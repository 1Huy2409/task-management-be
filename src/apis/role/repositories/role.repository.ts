import { Repository } from "typeorm";
import { IRoleRepository } from "./role.repository.interface";
import { Role, RoleScope } from "@/common/entities/role.entity";

export class RoleRepository implements IRoleRepository {
    constructor(
        private readonly roleRepository: Repository<Role>
    ) { }

    async findByName(name: string, scope: RoleScope): Promise<Role | null> {
        return await this.roleRepository.findOneBy({ name, scope });
    }

    async findById(id: string): Promise<Role | null> {
        return await this.roleRepository.findOneBy({ id });
    }

    async findByIdWithRelations(id: string): Promise<Role | null> {
        return await this.roleRepository.findOne({
            where: { id },
            relations: ["rolePermissions", "rolePermissions.permission"],
        });
    }

    async findByNameAndWorkspaceId(name: string, scope: RoleScope, workspaceId: string): Promise<Role | null> {
        return await this.roleRepository.findOne({
            where: { name, scope, workspaceId },
        });
    }

    async findByScopeAndWorkspaceId(scope: RoleScope, workspaceId: string | null): Promise<Role[]> {
        return await this.roleRepository.find({
            where: { scope, workspaceId: workspaceId as any },
            relations: ["rolePermissions", "rolePermissions.permission"],
        });
    }

    async findWorkspaceRoles(workspaceId: string): Promise<Role[]> {
        return await this.roleRepository.find({
            where: [
                { scope: RoleScope.WORKSPACE, workspaceId: null as any },
                { scope: RoleScope.WORKSPACE, workspaceId },
            ],
            relations: ["rolePermissions", "rolePermissions.permission"],
        });
    }

    async findBoardRoles(boardId: string): Promise<Role[]> {
        return await this.roleRepository.find({
            where: [
                { scope: RoleScope.BOARD, boardId: null as any }, 
                { scope: RoleScope.BOARD, boardId },
            ],
            relations: ["rolePermissions", "rolePermissions.permission"],
        });
    }

    async findByNameAndBoardId(name: string, scope: RoleScope, boardId: string): Promise<Role | null> {
        return await this.roleRepository.findOne({
            where: { name, scope, boardId },
        });
    }

    create(roleData: Partial<Role>): Role {
        return this.roleRepository.create(roleData);
    }

    async save(role: Role): Promise<Role> {
        return await this.roleRepository.save(role);
    }

    async delete(roleId: string): Promise<void> {
        await this.roleRepository.delete(roleId);
    }
}