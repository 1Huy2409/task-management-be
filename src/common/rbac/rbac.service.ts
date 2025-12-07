import { AppDataSource } from "@/config/db.config";
import { Workspace } from "../entities/workspace.entity";
import { Board } from "../entities/board.entity";
import { WorkspaceMember } from "../entities/workspace-member.entity";
import { BoardMember } from "../entities/board-member.entity";
import { ResourceType } from "../entities/permission.entity";
import { Role, RoleScope } from "../entities/role.entity";
import { PermissionKey } from "../constants/permissions";
import { Membership } from "./types";
import { RbacCacheService } from "./rbac.cache.service";


export class RbacService {
    private workspaceRepo = AppDataSource.getRepository(Workspace)
    private boardRepo = AppDataSource.getRepository(Board)
    private workspaceMemberRepo = AppDataSource.getRepository(WorkspaceMember)
    private boardMemberRepo = AppDataSource.getRepository(BoardMember)
    private rbacCacheService: RbacCacheService;
    constructor(
        cacheService?: RbacCacheService
    ) {
        this.rbacCacheService = cacheService || new RbacCacheService();
    }

    async canUser(
        userId: string,
        permissionAction: PermissionKey,
        context?: { workspaceId?: string; boardId?: string }
    ): Promise<boolean> {
        const startTime = process.hrtime.bigint();

        const cachedDecision = await this.rbacCacheService.getCachePermissionCheck(
            userId,
            permissionAction,
            context || {}
        );

        if (cachedDecision !== null) {
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1_000_000;
            console.log(`   [CACHE HIT] Permission check from cache: ${duration.toFixed(3)} ms`);
            console.log(`      User: ${userId}, Permission: ${permissionAction}, Result: ${cachedDecision}`);
            return cachedDecision;
        }

        console.log(`   [CACHE MISS] Computing permission from database...`);
        const dbStartTime = process.hrtime.bigint();
        const result = await this.computePermission(userId, permissionAction, context);
        const dbEndTime = process.hrtime.bigint();
        const dbDuration = Number(dbEndTime - dbStartTime) / 1_000_000;

        await this.rbacCacheService.cachePermissionCheck(
            userId,
            permissionAction,
            context || {},
            result
        );

        const totalEndTime = process.hrtime.bigint();
        const totalDuration = Number(totalEndTime - startTime) / 1_000_000;
        console.log(`      DB Query: ${dbDuration.toFixed(3)} ms, Total: ${totalDuration.toFixed(3)} ms`);
        console.log(`      User: ${userId}, Permission: ${permissionAction}, Result: ${result}`);

        return result;
    }
    private async computePermission(
        userId: string,
        permissionAction: PermissionKey,
        context?: { workspaceId?: string; boardId?: string }
    ): Promise<boolean> {
        let { workspaceId, boardId } = context || {};

        if (boardId && !workspaceId) {
            const board = await this.boardRepo.findOne({
                where: { id: boardId },
                relations: ["workspace"],
            });
            if (!board) return false;

            workspaceId = board.workspaceId;

            if (board.workspace.ownerId === userId) {
                return true;
            }
        }

        if (workspaceId && !boardId) {
            const workspace = await this.workspaceRepo.findOne({
                where: { id: workspaceId },
            });
            if (!workspace) return false;
            if (workspace.ownerId === userId) {
                return true;
            }
        }
        const memberships = await this.getMembershipsWithCache(
            userId,
            {
                ...(workspaceId && { workspaceId }),
                ...(boardId && { boardId })
            }
        );
        if (memberships.length === 0) {
            console.log('No memberships found for user:', userId);
            return false;
        }
        const priority = {
            [RoleScope.BOARD]: 3,
            [RoleScope.WORKSPACE]: 2,
            [RoleScope.GLOBAL]: 1,
        } as const;

        memberships.sort((a, b) => priority[b.scope] - priority[a.scope]);

        for (const m of memberships) {
            if (this.roleHasPermission(m.role, permissionAction)) {
                return true;
            }
        }
        console.log('Permission denied!!!')
        return false;
    }
    private async getMembershipsWithCache(
        userId: string,
        context: { workspaceId?: string; boardId?: string }
    ): Promise<Membership[]> {
        const { workspaceId, boardId } = context;
        const startTime = process.hrtime.bigint();

        const cachedMemberships = await this.rbacCacheService.getCacheMembership(
            userId,
            context
        );

        if (cachedMemberships !== null) {
            const endTime = process.hrtime.bigint();
            const duration = Number(endTime - startTime) / 1_000_000;
            console.log(`   [CACHE HIT] Membership from cache: ${duration.toFixed(3)} ms`);
            return cachedMemberships;
        }

        console.log(`   [CACHE MISS] Fetching membership from database...`);
        const dbStartTime = process.hrtime.bigint();
        const memberships: Membership[] = [];
        if (boardId) {
            const boardMember = await this.boardMemberRepo.findOne({
                where: { userId, boardId },
                relations: ["role", "role.rolePermissions", "role.rolePermissions.permission"],
            });

            if (boardMember) {
                memberships.push({
                    scope: RoleScope.BOARD,
                    role: boardMember.role,
                });
            }
        }

        if (workspaceId) {
            const workspaceMember = await this.workspaceMemberRepo.findOne({
                where: { userId, workspaceId },
                relations: ["role", "role.rolePermissions", "role.rolePermissions.permission"],
            });

            if (workspaceMember) {
                memberships.push({
                    scope: RoleScope.WORKSPACE,
                    role: workspaceMember.role,
                });
            }
        }
        const dbEndTime = process.hrtime.bigint();
        const dbDuration = Number(dbEndTime - dbStartTime) / 1_000_000;

        await this.rbacCacheService.cacheMembership(
            userId,
            context,
            memberships
        );

        console.log(`      DB Query: ${dbDuration.toFixed(3)} ms`);
        return memberships;
    }
    private async isWorkspaceOwnerCache(
        userId: string,
        workspaceId: string,
    ): Promise<boolean> {
        const cacheOwner = await this.rbacCacheService.getCacheWorkspaceOwner(
            userId,
            workspaceId
        );
        if (cacheOwner !== null) {
            console.log('Ownership Cached Hit');
            return cacheOwner;
        }
        const workspace = await this.workspaceRepo.findOne({
            where: { id: workspaceId },
        })
        const isOwner = workspace?.ownerId === userId;
        await this.rbacCacheService.cacheWorkspaceOwner(
            userId,
            workspaceId,
            isOwner
        );
        return isOwner;
    }
    async isWorkspaceOwner(
        userId: string,
        workspaceId: string,
    ): Promise<boolean> {
        return this.isWorkspaceOwnerCache(userId, workspaceId);
    }

    async onUserAddedToWorkspace(
        userId: string,
        workspaceId: string
    ): Promise<void> {
        await this.rbacCacheService.invalidateUserWorkspace(userId, workspaceId);
    }

    async onUserRemovedFromWorkspace(
        userId: string,
        workspaceId: string
    ): Promise<void> {
        await this.rbacCacheService.invalidateUserWorkspace(userId, workspaceId);
    }

    async onWorkspaceMemberRoleChanged(
        userId: string,
        workspaceId: string
    ): Promise<void> {
        await this.rbacCacheService.invalidateUserWorkspace(userId, workspaceId);
    }

    async onUserAddedToBoard(
        userId: string,
        boardId: string,
    ): Promise<void> {
        await this.rbacCacheService.invalidateUserBoard(userId, boardId);
    }
    async onUserRemovedFromBoard(
        userId: string,
        boardId: string,
    ): Promise<void> {
        await this.rbacCacheService.invalidateUserBoard(userId, boardId);
    }
    async onBoardMemberRoleChanged(
        userId: string,
        boardId: string,
    ): Promise<void> {
        await this.rbacCacheService.invalidateUserBoard(userId, boardId);
    }
    async onWorkspaceDeleted(
        workspaceId: string,
    ): Promise<void> {
        await this.rbacCacheService.invalidateWorkspace(workspaceId);
    }
    async onBoardDeleted(
        boardId: string,
    ): Promise<void> {
        await this.rbacCacheService.invalidateBoard(boardId);
    }
    async onRolePermissionsUpdated(
        roleId: string,
    ): Promise<void> {
        const workspaceMembers = await this.workspaceMemberRepo.find({
            where: { roleId },
            select: ["userId", "workspaceId"],
        });
        const boardMembers = await this.boardMemberRepo.find({
            where: { roleId },
            select: ["userId", "boardId"],
        });
        await Promise.all([
            ...workspaceMembers.map(wm =>
                this.rbacCacheService.invalidateUserWorkspace(wm.userId, wm.workspaceId)
            ),
            ...boardMembers.map(bm =>
                this.rbacCacheService.invalidateUserBoard(bm.userId, bm.boardId)
            )
        ]);
    }

    private roleHasPermission(
        role: Role,
        requiredAction: string,
    ): boolean {
        if (!role || !role.rolePermissions) {
            return false;
        }

        const resourceTypes = this.getCompatibleResourceTypes(role.scope);
        return role.rolePermissions.some((rp) => {
            const permission = rp.permission;
            return permission.action === requiredAction && resourceTypes.includes(permission.resourceType);
        })
    }

    private getCompatibleResourceTypes(scope: RoleScope): ResourceType[] {
        switch (scope) {
            case RoleScope.BOARD:
                // Board scope có thể quản lý: Board, List, Card
                return [
                    ResourceType.BOARD,
                    ResourceType.LIST,
                    ResourceType.CARD,
                    ResourceType.COMMENT
                ];
            case RoleScope.WORKSPACE:
                // Workspace scope có thể quản lý: Workspace, Board, List, Card
                return [
                    ResourceType.WORKSPACE,
                    ResourceType.BOARD,
                    ResourceType.LIST,
                    ResourceType.CARD,
                    ResourceType.COMMENT
                ];
            case RoleScope.GLOBAL:
            default:
                // Global có thể quản lý tất cả
                return Object.values(ResourceType);
        }
    }
}