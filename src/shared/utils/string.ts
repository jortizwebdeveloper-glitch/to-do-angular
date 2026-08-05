export function strNormalize(value: string) {
  return value
    .normalize('NFD') // separa el carácter base del acento
    .replace(/([\u0300-\u036f]|\s)/g, '')
    .toLowerCase();
}
