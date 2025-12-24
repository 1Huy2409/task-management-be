import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { Card } from "./card.entity";
import { ChecklistItem } from "./checklist-item.entity";

@Entity('checklists')
export class Checklist extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    title: string

    @Column({ type: 'uuid' })
    cardId: string

    @ManyToOne(() => Card, (card) => card.checklists, { onDelete: 'CASCADE' })
    card: Card

    @OneToMany(() => ChecklistItem, (item) => item.checklist, { cascade: true })
    items: ChecklistItem[]
}
