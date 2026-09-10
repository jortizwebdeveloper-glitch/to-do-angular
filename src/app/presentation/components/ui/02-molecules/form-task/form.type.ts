import z from 'zod';

export const taskSchema = z.object({
  title: z.string().min(5, 'EL título debe ser minimo de 5 caracteres'),
  description: z.string().nonempty('Descripcion obligatoria'),
  categoria: z.number().min(1, 'Debes selccionar una categoría'),
  tags: z.array(z.number()).min(1, 'Debes elegir como minimo 1 etiqueta'),
  priority: z.string().nonempty('Debes elegir una prioridad'),
  dueDate: z.string().nonempty('Debe asignar una fecha'),
});

export type TaskZod = z.infer<typeof taskSchema>;