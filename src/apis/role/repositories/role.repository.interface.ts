import { Role, RoleScope } from "@/common/entities/role.entity";

export interface IRoleRepository {
    findByName(name: string, scope: RoleScope): Promise<Role | null>;
    findById(id: string): Promise<Role | null>;
    findByIdWithRelations(id: string): Promise<Role | null>;
    findByNameAndWorkspaceId(name: string, scope: RoleScope, workspaceId: string): Promise<Role | null>;
    findByScopeAndWorkspaceId(scope: RoleScope, workspaceId: string | null): Promise<Role[]>;
    findWorkspaceRoles(workspaceId: string): Promise<Role[]>;
    findBoardRoles(boardId: string): Promise<Role[]>;
    findByNameAndBoardId(name: string, scope: RoleScope, boardId: string): Promise<Role | null>;
    create(roleData: Partial<Role>): Role;
    save(role: Role): Promise<Role>;
    delete(roleId: string): Promise<void>;
}