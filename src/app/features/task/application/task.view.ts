import type { CategoryViewModel } from '@app/features/category';
import type { TagViewModel } from '@app/features/tag';

export enum STATUS_TASK {
  pendiente = 'Pendiente',
  en_curso = 'En curso',
  completada = 'Completada',
}

export enum STATUS_COLOR {
  completada = 'emerald',
  en_curso = 'indigo',
  pendiente = 'amber',
}
export type TStatusTask = keyof typeof STATUS_TASK;
export const STATU_TASK_VALUES = Object.keys(STATUS_TASK) as TStatusTask[];

export function getStatus(key: TStatusTask) {
  return {
    color: STATUS_COLOR[key],
    label: STATUS_TASK[key],
  };
}

/** Opciones de estado para selects y dropdowns. Deriva del enum, no depende de nada externo. */
export const STATUS_OPTIONS = STATU_TASK_VALUES.map((value) => ({
  value,
  label: STATUS_TASK[value],
}));

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

/** Opciones de prioridad para selects. Deriva del enum, no depende de nada externo. */
export const PRIORITY_OPTIONS = PRIORITY_TASK_VALUES.map((value) => ({
  value,
  label: PRIORITY_TASK[value],
}));

export interface TaskViewModel {
  id: number;
  title: string;
  description: string;
  categoria: CategoryViewModel;
  tags: TagViewModel[];
  status: TStatusTask;
  dueDate: string;
  completeDate: string;
  priority: TProrityTask;
  finished: boolean;
}
