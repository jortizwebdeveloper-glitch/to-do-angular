export interface TaskEntity {
  id: number;
  title: string;
  description: string;
  categoria: number;
  tags: number[];
  status: string;
  dueDate: string;
  priority: string;
}
