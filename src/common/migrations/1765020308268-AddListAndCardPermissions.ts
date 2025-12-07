import { In, MigrationInterface, QueryRunner } from "typeorm";
import { Role, RoleScope } from "../entities/role.entity";
import { Permission, ResourceType } from "../entities/permission.entity";
import { RolePermission } from "../entities/role-permission.entity";
import { PERMISSIONS } from "../constants/permissions";

export class AddListAndCardPermissions1733500000000 implements MigrationInterface {
    name = 'AddListAndCardPermissions1733500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const roleRepository = queryRunner.manager.getRepository(Role);
        const permissionRepository = queryRunner.manager.getRepository(Permission);
        const rolePermissionRepository = queryRunner.manager.getRepository(RolePermission);

        console.log('Adding new LIST and CARD permissions...');

        // 1. Tạo permissions mới
        const newPermissionsData = [
            // LIST Permissions
            { action: PERMISSIONS.LIST_VIEW, resourceType: ResourceType.LIST, description: 'View lists in board' },
            { action: PERMISSIONS.LIST_CREATE, resourceType: ResourceType.LIST, description: 'Create new list' },
            { action: PERMISSIONS.LIST_UPDATE, resourceType: ResourceType.LIST, description: 'Update list details' },
            { action: PERMISSIONS.LIST_DELETE, resourceType: ResourceType.LIST, description: 'Delete list' },

            // CARD Permissions
            { action: PERMISSIONS.CARD_VIEW, resourceType: ResourceType.CARD, description: 'View cards in list' },
            { action: PERMISSIONS.CARD_CREATE, resourceType: ResourceType.CARD, description: 'Create new card' },
            { action: PERMISSIONS.CARD_UPDATE, resourceType: ResourceType.CARD, description: 'Update card details' },
            { action: PERMISSIONS.CARD_DELETE, resourceType: ResourceType.CARD, description: 'Delete card' },
            { action: PERMISSIONS.CARD_ASSIGN, resourceType: ResourceType.CARD, description: 'Assign card to members' },

            // COMMENT Permissions
            { action: PERMISSIONS.COMMENT_VIEW, resourceType: ResourceType.COMMENT, description: 'View comments' },
            { action: PERMISSIONS.COMMENT_CREATE, resourceType: ResourceType.COMMENT, description: 'Create comment' },
            { action: PERMISSIONS.COMMENT_UPDATE, resourceType: ResourceType.COMMENT, description: 'Update own comment' },
            { action: PERMISSIONS.COMMENT_DELETE, resourceType: ResourceType.COMMENT, description: 'Delete own comment' },
        ];

        const createdPermissions = await permissionRepository.save(newPermissionsData);
        console.log(`Created ${createdPermissions.length} new permissions`);

        // 2. Lấy các role hiện có
        const workspaceOwner = await roleRepository.findOne({ where: { name: 'workspace_owner', isSystemRole: true } });
        const workspaceAdmin = await roleRepository.findOne({ where: { name: 'workspace_admin', isSystemRole: true } });
        const workspaceMember = await roleRepository.findOne({ where: { name: 'workspace_member', isSystemRole: true } });
        const boardOwner = await roleRepository.findOne({ where: { name: 'board_owner', isSystemRole: true } });
        const boardAdmin = await roleRepository.findOne({ where: { name: 'board_admin', isSystemRole: true } });
        const boardMember = await roleRepository.findOne({ where: { name: 'board_member', isSystemRole: true } });

        const getPermission = (action: string) => createdPermissions.find(p => p.action === action);

        // 3. Gán permissions cho workspace_owner (full permissions)
        if (workspaceOwner) {
            const workspaceOwnerPermissions = createdPermissions.map(p => ({
                roleId: workspaceOwner.id,
                permissionId: p.id
            }));
            await rolePermissionRepository.save(workspaceOwnerPermissions);
            console.log('Added all new permissions to workspace_owner');
        }

        // 4. Gán permissions cho workspace_admin
        if (workspaceAdmin) {
            const workspaceAdminActions = [
                PERMISSIONS.LIST_VIEW,
                PERMISSIONS.LIST_CREATE,
                PERMISSIONS.LIST_UPDATE,
                PERMISSIONS.LIST_DELETE,
                PERMISSIONS.CARD_VIEW,
                PERMISSIONS.CARD_CREATE,
                PERMISSIONS.CARD_UPDATE,
                PERMISSIONS.CARD_DELETE,
                PERMISSIONS.CARD_ASSIGN,
                PERMISSIONS.COMMENT_VIEW,
                PERMISSIONS.COMMENT_CREATE,
                PERMISSIONS.COMMENT_UPDATE,
                PERMISSIONS.COMMENT_DELETE,
            ];

            const workspaceAdminPermissions = workspaceAdminActions
                .map(action => {
                    const permission = getPermission(action);
                    return permission ? { roleId: workspaceAdmin.id, permissionId: permission.id } : null;
                })
                .filter(p => p !== null);

            await rolePermissionRepository.save(workspaceAdminPermissions);
            console.log('Added permissions to workspace_admin');
        }

        // 5. Gán permissions cho workspace_member (chỉ view và create)
        if (workspaceMember) {
            const workspaceMemberActions = [
                PERMISSIONS.LIST_VIEW,
                PERMISSIONS.LIST_CREATE,
                PERMISSIONS.CARD_VIEW,
                PERMISSIONS.CARD_CREATE,
                PERMISSIONS.CARD_UPDATE,
                PERMISSIONS.COMMENT_VIEW,
                PERMISSIONS.COMMENT_CREATE,
                PERMISSIONS.COMMENT_UPDATE,
            ];

            const workspaceMemberPermissions = workspaceMemberActions
                .map(action => {
                    const permission = getPermission(action);
                    return permission ? { roleId: workspaceMember.id, permissionId: permission.id } : null;
                })
                .filter(p => p !== null);

            await rolePermissionRepository.save(workspaceMemberPermissions);
            console.log('Added permissions to workspace_member');
        }

        // 6. Gán permissions cho board_owner (full board-level permissions)
        if (boardOwner) {
            const boardOwnerActions = [
                PERMISSIONS.LIST_VIEW,
                PERMISSIONS.LIST_CREATE,
                PERMISSIONS.LIST_UPDATE,
                PERMISSIONS.LIST_DELETE,
                PERMISSIONS.CARD_VIEW,
                PERMISSIONS.CARD_CREATE,
                PERMISSIONS.CARD_UPDATE,
                PERMISSIONS.CARD_DELETE,
                PERMISSIONS.CARD_ASSIGN,
                PERMISSIONS.COMMENT_VIEW,
                PERMISSIONS.COMMENT_CREATE,
                PERMISSIONS.COMMENT_UPDATE,
                PERMISSIONS.COMMENT_DELETE,
            ];

            const boardOwnerPermissions = boardOwnerActions
                .map(action => {
                    const permission = getPermission(action);
                    return permission ? { roleId: boardOwner.id, permissionId: permission.id } : null;
                })
                .filter(p => p !== null);

            await rolePermissionRepository.save(boardOwnerPermissions);
            console.log('Added permissions to board_owner');
        }

        // 7. Gán permissions cho board_admin
        if (boardAdmin) {
            const boardAdminActions = [
                PERMISSIONS.LIST_VIEW,
                PERMISSIONS.LIST_CREATE,
                PERMISSIONS.LIST_UPDATE,
                PERMISSIONS.LIST_DELETE,
                PERMISSIONS.CARD_VIEW,
                PERMISSIONS.CARD_CREATE,
                PERMISSIONS.CARD_UPDATE,
                PERMISSIONS.CARD_DELETE,
                PERMISSIONS.CARD_ASSIGN,
                PERMISSIONS.COMMENT_VIEW,
                PERMISSIONS.COMMENT_CREATE,
                PERMISSIONS.COMMENT_UPDATE,
                PERMISSIONS.COMMENT_DELETE,
            ];

            const boardAdminPermissions = boardAdminActions
                .map(action => {
                    const permission = getPermission(action);
                    return permission ? { roleId: boardAdmin.id, permissionId: permission.id } : null;
                })
                .filter(p => p !== null);

            await rolePermissionRepository.save(boardAdminPermissions);
            console.log('Added permissions to board_admin');
        }

        // 8. Gán permissions cho board_member (chỉ view và edit cơ bản)
        if (boardMember) {
            const boardMemberActions = [
                PERMISSIONS.LIST_VIEW,
                PERMISSIONS.CARD_VIEW,
                PERMISSIONS.CARD_CREATE,
                PERMISSIONS.CARD_UPDATE,
                PERMISSIONS.COMMENT_VIEW,
                PERMISSIONS.COMMENT_CREATE,
                PERMISSIONS.COMMENT_UPDATE,
            ];

            const boardMemberPermissions = boardMemberActions
                .map(action => {
                    const permission = getPermission(action);
                    return permission ? { roleId: boardMember.id, permissionId: permission.id } : null;
                })
                .filter(p => p !== null);

            await rolePermissionRepository.save(boardMemberPermissions);
            console.log('Added permissions to board_member');
        }

        console.log('Successfully added new permissions to all roles!');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const permissionRepository = queryRunner.manager.getRepository(Permission);
        const rolePermissionRepository = queryRunner.manager.getRepository(RolePermission);

        // Xóa role-permission mappings
        const permissionsToDelete = await permissionRepository.find({
            where: [
                { action: PERMISSIONS.LIST_VIEW },
                { action: PERMISSIONS.LIST_CREATE },
                { action: PERMISSIONS.LIST_UPDATE },
                { action: PERMISSIONS.LIST_DELETE },
                { action: PERMISSIONS.CARD_VIEW },
                { action: PERMISSIONS.CARD_CREATE },
                { action: PERMISSIONS.CARD_UPDATE },
                { action: PERMISSIONS.CARD_DELETE },
                { action: PERMISSIONS.CARD_ASSIGN },
                { action: PERMISSIONS.COMMENT_VIEW },
                { action: PERMISSIONS.COMMENT_CREATE },
                { action: PERMISSIONS.COMMENT_UPDATE },
                { action: PERMISSIONS.COMMENT_DELETE },
            ]
        });

        const permissionIds = permissionsToDelete.map(p => p.id);

        await rolePermissionRepository.delete({ permissionId: In(permissionIds) });
        await permissionRepository.remove(permissionsToDelete);

        console.log('Rollback completed - removed new permissions');
    }
}