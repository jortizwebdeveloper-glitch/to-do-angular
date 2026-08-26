import { z } from 'zod';

import { PRIORITY_TASK_VALUES, STATU_TASK_VALUES } from './task.view';

export const baseTaskSchemaDTO = z.object({
  id: z.coerce.number(),
  title: z.string().min(5),
  description: z.string().nonempty(),
  categoria: z.coerce.number().min(1),
  tags: z.array(z.coerce.number()).min(1),
  priority: z.enum(PRIORITY_TASK_VALUES),
  status: z.enum(STATU_TASK_VALUES).default('en_curso'),
  dueDate: z
    .string()
    .nonempty()
    .transform((val) => val.replace(/-/g, '/')),
});

export const createTaskSchemaDTO = baseTaskSchemaDTO.omit({ id: true, status: true });
export type CreateTaskDTO = z.infer<typeof createTaskSchemaDTO>;

export const updateTaskSchemaDTO = createTaskSchemaDTO.partial();
export type UpdateTaskDTO = z.infer<typeof updateTaskSchemaDTO>;

export const idTaskSchemaDTO = baseTaskSchemaDTO.pick({ id: true });
export type IdTaskDTO = z.infer<typeof idTaskSchemaDTO>;

export const statusTaskSchemaDTO = baseTaskSchemaDTO.pick({ status: true });
export type StatusTaskDTO = z.infer<typeof statusTaskSchemaDTO>;
