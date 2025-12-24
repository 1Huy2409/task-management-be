import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Column } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { List } from "./list.entity";
import { Comment } from "./comment.entity";
import { CardMember } from "./card-member.entity";
import { Checklist } from "./checklist.entity";

@Entity('cards')
export class Card extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', default: 0 })
    position: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    coverUrl: string;

    @Column({ type: 'enum', enum: ['low', 'medium', 'high'], default: 'medium' })
    priority: string;

    @Column({ name: 'dueDate', type: 'date', nullable: true })
    dueDate: Date;

    @OneToMany(() => Comment, (comment) => comment.card)
    comments: Comment[]

    @OneToMany(() => CardMember, (cardMember) => cardMember.card)
    cardMembers: CardMember[]

    @OneToMany(() => Checklist, (checklist) => checklist.card)
    checklists: Checklist[]

    @Column({ type: 'uuid' })
    listId: string

    @ManyToOne(() => List, (list) => list.cards)
    list: List
}