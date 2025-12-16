import { RoleScope } from "@/common/entities/role.entity";
import { CreateBoardRoleDto, UpdateBoardRoleDto } from "./dto/board-role.dto";
import { toBoardRoleResponse } from "./mapper/board-role.mapper";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/common/handler/error.response";
import { IRoleRepository } from "../role/repositories/role.repository.interface";
import { IPermissionRepository } from "../permission/repositories/permission.repository.interface";
import { IRolePermissionRepository } from "../role-permission/repositories/role-permission.repository.interface";
import { RbacService } from "@/common/rbac/rbac.service";

export class BoardRoleService {
    constructor(
        private roleRepo: IRoleRepository,
        private permissionRepo: IPermissionRepository,
        private rolePermissionRepo: IRolePermissionRepository,
        private rbacService: RbacService
    ) { }

    async getRoles(boardId: string) {
        const roles = await this.roleRepo.findBoardRoles(boardId);
        return roles.map(toBoardRoleResponse);
    }

    async createRole(boardId: string, dto: CreateBoardRoleDto) {
        const { name, description, permissions } = dto;

        const existing = await this.roleRepo.findByNameAndBoardId(
            name,
            RoleScope.BOARD,
            boardId
        );

        if (existing) {
            throw new BadRequestError("Role name already exists in this board");
        }

        const role = this.roleRepo.create({
            name,
            description: description || '',
            scope: RoleScope.BOARD,
            boardId,
            isSystemRole: false,
        });

        await this.roleRepo.save(role);

        if (permissions && permissions.length > 0) {
            const perms = await this.permissionRepo.findByActions(permissions);

            const rolePermissions = perms.map((p) =>
                this.rolePermissionRepo.create({
                    roleId: role.id,
                    permissionId: p.id,
                })
            );

            await this.rolePermissionRepo.save(rolePermissions);
        }

        const createdRole = await this.roleRepo.findByIdWithRelations(role.id);
        if (!createdRole) {
            throw new NotFoundError("Failed to retrieve created role");
        }
        return toBoardRoleResponse(createdRole);
    }

    async updateRole(boardId: string, roleId: string, dto: UpdateBoardRoleDto) {
        const role = await this.roleRepo.findByIdWithRelations(roleId);

        if (!role) throw new NotFoundError("Role not found");

        if (role.scope !== RoleScope.BOARD) {
            throw new BadRequestError("Only board roles can be updated here");
        }
        if (role.isSystemRole && role.boardId === null) {
            throw new ForbiddenError("System roles cannot be modified");
        }

        if (role.boardId !== boardId) {
            throw new ForbiddenError("Role does not belong to this board");
        }

        if (dto.name) role.name = dto.name;
        if (dto.description !== undefined) role.description = dto.description;

        await this.roleRepo.save(role);

        if (dto.permissions) {
            // clear old permissions
            await this.rolePermissionRepo.deleteByRoleId(role.id);

            if (dto.permissions.length > 0) {
                const perms = await this.permissionRepo.findByActions(dto.permissions);

                const rolePermissions = perms.map((p) =>
                    this.rolePermissionRepo.create({
                        roleId: role.id,
                        permissionId: p.id,
                    })
                );

                await this.rolePermissionRepo.save(rolePermissions);
            }
            await this.rbacService.onRolePermissionsUpdated(roleId);
        }

        const updatedRole = await this.roleRepo.findByIdWithRelations(role.id);
        if (!updatedRole) {
            throw new NotFoundError("Failed to retrieve updated role");
        }
        return toBoardRoleResponse(updatedRole);
    }

    async deleteRole(boardId: string, roleId: string) {
        const role = await this.roleRepo.findById(roleId);

        if (!role) throw new NotFoundError("Role not found");

        if (role.scope !== RoleScope.BOARD) {
            throw new BadRequestError("Only board roles can be deleted here");
        }

        if (role.isSystemRole && role.boardId === null) {
            throw new ForbiddenError("System roles cannot be deleted");
        }

        if (role.boardId !== boardId) {
            throw new ForbiddenError("Role does not belong to this board");
        }

        await this.roleRepo.delete(roleId);
        await this.rbacService.onRolePermissionsUpdated(roleId);
    }
}
