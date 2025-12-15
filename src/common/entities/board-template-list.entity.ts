import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { BoardTemplate } from "./board-template.entity";

@Entity('board_template_lists')
export class BoardTemplateList extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'uuid' })
    templateId: string

    @Column({ type: 'varchar', length: 255 })
    title: string

    @Column({ type: 'float', default: 0 })
    position: number

    @ManyToOne(() => BoardTemplate, (template) => template.lists, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'templateId' })
    template: BoardTemplate
}
