import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { Workspace } from "./workspace.entity";
import { List } from "./list.entity";
import { BoardMember } from "./board-member.entity";
import { BoardJoinLink } from "./board-join-link.entity";
import { User } from "./user.entity";

export enum BoardVisibility {
    PRIVATE = 'private',
    WORKSPACE = 'workspace',
    PUBLIC = 'public'
}
export enum BoardStatus {
    ACTIVE = 'active',
    ARCHIVED = 'archived'
}
@Entity('boards')
export class Board extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    coverUrl: string;

    @Column({ type: 'enum', enum: BoardVisibility, default: BoardVisibility.WORKSPACE })
    visibility: BoardVisibility;

    @Column({ type: 'enum', enum: BoardStatus, default: BoardStatus.ACTIVE })
    status: BoardStatus;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    isTemplate: boolean;

    @Column({ type: 'uuid' })
    ownerId: string;

    @ManyToOne(() => User, (user) => user.boardMembers, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'ownerId' })
    owner: User;
    @Column({ type: 'uuid', nullable: true })
    createdBy: string

    @Column({ type: 'uuid' })
    workspaceId: string

    @ManyToOne(() => Workspace, (workspace) => workspace.boards, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workspaceId' })
    workspace: Workspace

    @OneToMany(() => BoardMember, (boardMember) => boardMember.board)
    boardMembers: BoardMember[]

    @OneToMany(() => List, (list) => list.board)
    lists: List[]

    @OneToMany(() => BoardJoinLink, (joinLink) => joinLink.board)
    joinLinks: BoardJoinLink[]
}