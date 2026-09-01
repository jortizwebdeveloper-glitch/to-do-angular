import { getColor } from '@app/core/shared/theme/color.registry';

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

export function filterByDate(date: string, status: boolean) {
  const $date = resetTime(date);
  const $now = resetTime(Date.now());

  return $date > $now
    ? 'proximas'
    : $date < $now && !status
      ? 'vencidas'
      : status
        ? 'finalizadas'
        : 'hoy';
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

export function getDate(date: string) {
  const key = keyDate(date ?? '');
  const over = overDue(date ?? '');

  return {
    overDue: over,
    color: over ? getColor('red') : key ? getColor(DATE_COLOR[key]) : null,
    label: key ? DATE_TASK[key] : date,
  };
}
