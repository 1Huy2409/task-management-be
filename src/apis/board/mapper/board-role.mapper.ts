
import { Role } from "@/common/entities/role.entity";
import { BoardRoleResponseSchema } from "../schemas/board-role/board-role.response.schema";

export const toBoardRoleResponse = (role: Role): BoardRoleResponseSchema => {
    return {
        id: role.id,
        name: role.name,
        description: role.description || null,
        scope: role.scope,
        isSystemRole: role.isSystemRole,
        permissions: role.rolePermissions
            ? role.rolePermissions.map((rp) => rp.permission.action)
            : [],
        createdAt: role.created_at,
        updatedAt: role.updated_at
    };
};
