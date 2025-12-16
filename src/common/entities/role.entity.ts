import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { WorkspaceMember } from "./workspace-member.entity";
import { Board } from "./board.entity";
import { BoardMember } from "./board-member.entity";
import { RolePermission } from "./role-permission.entity";
import { Workspace } from "./workspace.entity";

export enum RoleScope {
    GLOBAL = 'global',
    WORKSPACE = 'workspace',
    BOARD = 'board'
}
@Entity('roles')
@Unique('UQ_role_name_scope_workspace', ['name', 'scope', 'workspaceId'])
export class Role extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'enum', enum: RoleScope })
    scope: RoleScope

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'boolean', default: false })
    isSystemRole: boolean

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
    rolePermissions: RolePermission[]

    @OneToMany(() => WorkspaceMember, (member) => member.role)
    workspaceMembers: WorkspaceMember[]

    @OneToMany(() => BoardMember, (member) => member.role)
    boardMembers: BoardMember[]

    @Column({ type: 'uuid', nullable: true })
    workspaceId: string | null;

    @ManyToOne(() => Workspace, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workspaceId' })
    workspace: Workspace | null;

    @Column({ type: 'uuid', nullable: true })
    boardId: string | null;

    
    @ManyToOne('Board', { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'boardId' })
    board: Board | null;
}