import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("attachments")
export class AttachmentEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  url: string;

  @Column({ type: "uuid" })
  cardId: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}