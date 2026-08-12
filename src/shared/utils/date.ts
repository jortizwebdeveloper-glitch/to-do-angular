
function resetTime(date: string | number) {
  const $date = new Date(date);
  $date.setHours(0, 0, 0, 0);
  return $date;
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

export function overDue(date:string){
  const $date = resetTime(date);
  const $now = resetTime(Date.now());

  const msPerDay = 24 * 60 * 60 * 1000;
  const diffInDays = Math.round(($date.getTime() - $now.getTime()) / msPerDay);

  return diffInDays < 0;

}

export function keyDate(date: string) {
  const $date = resetTime(date);
  const $now = resetTime(Date.now());

  const msPerDay = 24 * 60 * 60 * 1000;
  const diffInDays = Math.round(($date.getTime() - $now.getTime()) / msPerDay);
  switch (diffInDays) {
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