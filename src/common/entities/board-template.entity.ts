import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { BoardTemplateList } from "./board-template-list.entity";

export enum BoardTemplateType {
    SYSTEM = 'SYSTEM',
    CUSTOM = 'CUSTOM'
}

@Entity('board_templates')
export class BoardTemplate extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    name: string

    @Column({ type: 'text', nullable: true })
    description: string | null

    @Column({ type: 'varchar', length: 255, nullable: true })
    coverUrl: string | null

    @Column({ type: 'enum', enum: BoardTemplateType, default: BoardTemplateType.SYSTEM })
    type: BoardTemplateType

    @OneToMany(() => BoardTemplateList, (list) => list.template)
    lists: BoardTemplateList[]
}
