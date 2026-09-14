import { getColor } from '@app/core/shared/theme/color.registry';
import type { TStatusTask } from '@app/features/task';
import { STATUS_COLOR } from '@app/features/task';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

/**
 * Parsea un día del calendario ("YYYY/MM/DD", también acepta "-") como medianoche **local**.
 *
 * No usar `new Date(string)`: el motor lo interpreta como medianoche UTC si el string trae
 * guiones y como local si trae barras, así que la fecha se corría un día entero en cualquier
 * zona con offset negativo.
 */
function parseDay(date: string) {
  const [year, month, day] = date.split(/[/-]/).map(Number);
  return new Date(year, month - 1, day);
}

/** Medianoche local de hoy, el punto de referencia contra el que se comparan las fechas. */
function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function diffInDays(date: string) {
  // Math.round absorbe los días de 23 y 25 horas de los cambios de horario de verano.
  return Math.round((parseDay(date).getTime() - startOfToday().getTime()) / MS_PER_DAY);
}

export function filterByDate(date: string, finished: boolean) {
  if (finished) return 'finalizadas';

  const diff = diffInDays(date);
  return diff > 0 ? 'proximas' : diff < 0 ? 'vencidas' : 'hoy';
}

export function overDue(date: string) {
  return diffInDays(date) < 0;
}

export function keyDate(date: string) {
  switch (diffInDays(date)) {
    case -1:
      return 'yesterday';
    case 0:
      return 'today';
    case 1:
      return 'tomorrow';
    default:
      return null;
  }
}

export function getDate(date: string, status?: TStatusTask) {
  const key = keyDate(date ?? '');
  const over = overDue(date ?? '');
  const incomplete = status !== 'completada';
  return {
    overDue: over && incomplete,
    incomplete,
    color: !incomplete
      ? getColor(STATUS_COLOR['completada'])
      : over
        ? getColor('red')
        : key
          ? getColor(DATE_COLOR[key])
          : null,
    label: key ? DATE_TASK[key] : date,
  };
}

/**
 * Normaliza una fecha al formato con el que se persiste todo `dueDate`/`completeDate`:
 * "YYYY/MM/DD", en el día del calendario **local del usuario**.
 *
 * Antes formateaba con `timeZone: 'America/Bogota'` fijo, mientras que las comparaciones
 * usaban la medianoche local del navegador: fuera de Bogotá los dos relojes no coincidían y
 * una tarea creada para hoy se guardaba como la de ayer, y se mostraba vencida.
 */
export function formatDate(date: string | number = Date.now()) {
  const $date = typeof date === 'string' ? parseDay(date) : new Date(date);

  if (Number.isNaN($date.getTime())) {
    throw new RangeError(`formatDate: fecha inválida (${date})`);
  }

  const year = $date.getFullYear();
  const month = String($date.getMonth() + 1).padStart(2, '0');
  const day = String($date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}
