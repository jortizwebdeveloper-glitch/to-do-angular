import type { CategoryViewModel } from '@app/features/category';
import type { TagViewModel } from '@app/features/tag';

export enum STATUS_TASK {
  completada = 'Completada',
  en_curso = 'En curso',
  pendiente = 'Pendiente',
}

export enum STATUS_COLOR {
  completada = 'emerald',
  en_curso = 'indigo',
  pendiente = 'amber',
}
export type TStatusTask = keyof typeof STATUS_TASK;

export function getStatus(key: TStatusTask) {
  return {
    color: STATUS_COLOR[key],
    label: STATUS_TASK[key],
  };
}

export enum PRIORITY_TASK {
  alta = 'Alta',
  media = 'Media',
  baja = 'Baja',
}

export enum PRIORITY_COLOR {
  alta = 'red',
  media = 'orange',
  baja = 'blue',
}

export type TProrityTask = keyof typeof PRIORITY_TASK;
export const PRIORITY_TASK_VALUES = Object.keys(PRIORITY_TASK) as TProrityTask[];

export function getPriority(key: TProrityTask) {
  return {
    label: PRIORITY_TASK[key],
    color: PRIORITY_COLOR[key],
  };
}

export interface TaskViewModel {
  id: number;
  title: string;
  description: string;
  categoria: CategoryViewModel;
  tags: TagViewModel[];
  status: TStatusTask;
  dueDate: string;
  priority: TProrityTask;
}
