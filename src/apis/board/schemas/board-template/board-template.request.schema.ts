import { z } from 'zod';
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateBoardTemplateSchema = z.object({
    name: z.string().min(1).max(255).openapi({ example: 'Software Development' }),
    description: z.string().optional().openapi({ example: 'Template for software projects' }),
    coverUrl: z.string().url().optional().openapi({ example: 'https://example.com/cover.jpg' }),
    lists: z.array(z.object({
        title: z.string().min(1).max(255).openapi({ example: 'To Do' }),
        position: z.number().optional().openapi({ example: 1000 })
    })).optional().openapi({ example: [{ title: 'To Do', position: 1000 }, { title: 'In Progress', position: 2000 }, { title: 'Done', position: 3000 }] })
});

export type CreateBoardTemplateDto = z.infer<typeof CreateBoardTemplateSchema>;

export const PostBoardTemplateRequest: ZodRequestBody = {
    description: 'Create a new board template',
    content: {
        'application/json': {
            schema: CreateBoardTemplateSchema
        }
    }
};

export const CreateBoardTemplateFromBoardSchema = z.object({
    name: z.string().min(1).max(255).openapi({ example: 'My Custom Template' }),
    description: z.string().optional().openapi({ example: 'Template created from Project Alpha' })
});

export type CreateBoardTemplateFromBoardDto = z.infer<typeof CreateBoardTemplateFromBoardSchema>;

export const PostCreateTemplateFromBoardRequest: ZodRequestBody = {
    description: 'Create a template from an existing board',
    content: {
        'application/json': {
            schema: CreateBoardTemplateFromBoardSchema
        }
    }
};
