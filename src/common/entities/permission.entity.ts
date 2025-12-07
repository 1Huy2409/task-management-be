import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { Role } from "./role.entity";
import { RolePermission } from "./role-permission.entity";

export enum ResourceType {
    GLOBAL = 'global',
    WORKSPACE = 'workspace',
    BOARD = 'board',
    LIST = 'list',
    CARD = 'card',
    COMMENT = 'comment',
}

@Entity('permissions')
@Unique('UQ_permission_action_resource', ['action', 'resourceType'])
export class Permission extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 100 })
    action: string;

    @Column({ type: 'enum', enum: ResourceType })
    resourceType: ResourceType

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
    rolePermissions: RolePermission[]
}