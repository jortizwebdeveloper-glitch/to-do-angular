import { TColors } from '../shared/theme/color.registry';

export enum STATUS_TASK {
  completada = 'Completada',
  en_curso = 'En curso',
  pendiente = 'Pendiente',
}

export enum STATUS_COLOR {
  completada = 'green',
  en_curso = 'blue',
  pendiente = 'yellow',
}
export type TStatusTask = keyof typeof STATUS_TASK;

export function getStatus(key: TStatusTask) {
  return {
    color: STATUS_COLOR[key],
    label: STATUS_TASK[key],
  };
}

export enum DATE_TASK {
  yesterday = 'Ayer',
  today = 'Hoy',
  tomorrow = 'Mañana',
}

export enum DATE_COLOR {
  yesterday = 'rose',
  today = 'blue',
  tomorrow = 'amber',
}
export type TDateTask = keyof typeof DATE_TASK;

export function getDate(key: TDateTask) {
  return {
    color: DATE_COLOR[key],
    label: DATE_TASK[key],
  };
}

export enum PRIORITY_TASK {
  alta = 'Alta',
  media = 'Media',
  baja = 'Baja',
}
export type TProrityTask = keyof typeof PRIORITY_TASK;

export enum PRIORITY_COLOR {
  alta = 'red',
  media = 'orange',
  baja = 'blue',
}

export function getPriority(key: TProrityTask) {
  return {
    label: PRIORITY_TASK[key],
    color: PRIORITY_COLOR[key],
  };
}

export type TType = {
  id: number;
  name: string;
  color: TColors;
};

export type TCategory = {
  id: number;
  name: string;
  color: TColors;
};

export type TTask = {
  id: number;
  title: string;
  description: string;
  categoria: TCategory;
  tags: Array<TType>;
  status: TStatusTask;
  dueDate: string;
  priority: TProrityTask;
};
