export type TaskEntity = {
  id: number;
  title: string;
  description: string;
  categoria: number;
  tags: Array<number>;
  status: string;
  dueDate: string;
  priority: string;
};
