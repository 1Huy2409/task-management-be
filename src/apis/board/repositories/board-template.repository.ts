import { Repository } from "typeorm";
import { BoardTemplate } from "@/common/entities/board-template.entity";
import { IBoardTemplateRepository } from "./board-template.repository.interface";
import { BoardTemplateList } from "@/common/entities/board-template-list.entity";

export class BoardTemplateRepository implements IBoardTemplateRepository {
    constructor(private repository: Repository<BoardTemplate>) { }

    async findAll(): Promise<BoardTemplate[]> {
        return await this.repository.find();
    }

    async findById(id: string): Promise<BoardTemplate | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async findByIdWithLists(id: string): Promise<BoardTemplate | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['lists'],
            order: {
                lists: {
                    position: 'ASC'
                }
            }
        });
    }

    async createWithLists(data: Partial<BoardTemplate>, lists: { title: string, position: number }[]): Promise<BoardTemplate> {
        return await this.repository.manager.transaction(async (manager) => {
            const template = manager.create(BoardTemplate, data);
            const savedTemplate = await manager.save(template);

            if (lists && lists.length > 0) {
                const listEntities = lists.map(list => manager.create(BoardTemplateList, {
                    ...list,
                    template: savedTemplate
                }));
                await manager.save(listEntities);
            }

            return savedTemplate;
        });
    }
}
