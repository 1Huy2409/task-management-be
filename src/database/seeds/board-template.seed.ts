import { DataSource } from 'typeorm';
import { BoardTemplate, BoardTemplateType } from '../../common/entities/board-template.entity';
import { BoardTemplateList } from '../../common/entities/board-template-list.entity';

export const seedBoardTemplates = async (dataSource: DataSource) => {
    const templateRepo = dataSource.getRepository(BoardTemplate);
    const listRepo = dataSource.getRepository(BoardTemplateList);

    const kanbanTemplate = await templateRepo.findOne({ where: { name: 'Kanban Board' } });

    if (!kanbanTemplate) {
        console.log('Seeding Kanban Board Template...');
        const template = templateRepo.create({
            name: 'Kanban Board',
            description: 'A simple Kanban board with To Do, In Progress, and Done lists.',
            type: BoardTemplateType.SYSTEM,
            coverUrl: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&q=80',
        });
        const savedTemplate = await templateRepo.save(template);

        const lists = [
            { title: 'To Do', position: 1024 },
            { title: 'In Progress', position: 2048 },
            { title: 'Done', position: 3072 },
        ];

        for (const listData of lists) {
            await listRepo.save(listRepo.create({
                ...listData,
                template: savedTemplate
            }));
        }
        console.log('Kanban Board Template seeded successfully.');
    } else {
        console.log('Kanban Board Template already exists.');
    }
};
