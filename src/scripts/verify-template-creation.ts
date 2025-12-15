import { AppDataSource } from '../config/db.config';
import { seedBoardTemplates } from '../database/seeds/board-template.seed';
import { BoardTemplate } from '../common/entities/board-template.entity';

const verifyTemplateCreation = async () => {
    try {
        await AppDataSource.initialize();
        console.log('DataSource initialized.');

        await seedBoardTemplates(AppDataSource);

        const templateRepo = AppDataSource.getRepository(BoardTemplate);
        const templates = await templateRepo.find({ relations: ['lists'] });

        if (templates.length > 0) {
            console.log('✅ Board Templates found:', templates.length);
            templates.forEach(t => {
                console.log(`- Template: ${t.name} (Type: ${t.type})`);
                console.log(`  Lists: ${t.lists?.length || 0}`);
                t.lists?.forEach(l => console.log(`    * [${l.position}] ${l.title}`));
            });
        } else {
            console.error('❌ No templates found after seeding!');
        }

        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Error verifying template creation:', error);
        process.exit(1);
    }
};

verifyTemplateCreation();
