import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { Checklist } from "./checklist.entity";

@Entity('checklist_items')
export class ChecklistItem extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    title: string

    @Column({ type: 'boolean', default: false })
    isChecked: boolean

    @Column({ type: 'uuid' })
    checklistId: string

    @Column({ type: 'int', default: 0 })
    position: number

    @ManyToOne(() => Checklist, (checklist) => checklist.items, { onDelete: 'CASCADE' })
    checklist: Checklist
}
