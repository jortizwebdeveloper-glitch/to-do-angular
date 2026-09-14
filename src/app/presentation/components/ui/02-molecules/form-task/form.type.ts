import z from 'zod';

export const taskSchema = z.object({
  title: z.string().min(5, 'El título debe ser mínimo de 5 caracteres'),
  description: z.string().nonempty('Descripción obligatoria'),
  categoria: z.number().min(1, 'Debes seleccionar una categoría'),
  tags: z.array(z.number()).min(1, 'Debes elegir como mínimo 1 etiqueta'),
  priority: z.string().nonempty('Debes elegir una prioridad'),
  dueDate: z.string().nonempty('Debes asignar una fecha'),
});

export type TaskZod = z.infer<typeof taskSchema>;