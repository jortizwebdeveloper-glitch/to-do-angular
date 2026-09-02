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

function resetTime(date: string | number) {
  const $date = new Date(date);
  $date.setHours(0, 0, 0, 0);
  return $date;
}

function diffInDays(date: string) {
  const $date = resetTime(date);
  const $now = resetTime(Date.now());
  return Math.round(($date.getTime() - $now.getTime()) / MS_PER_DAY);
}

export function filterByDate(date: string, finished: boolean) {
  const $date = resetTime(date);
  const $now = resetTime(Date.now());

  return finished ? 'finalizadas' : $date > $now ? 'proximas' : $date < $now ? 'vencidas' : 'hoy';
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

export function formatDate(date: string | number = Date.now()) {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/Bogota',
  })
    .format(new Date(date))
    .replace(/-/g, '/');
}
