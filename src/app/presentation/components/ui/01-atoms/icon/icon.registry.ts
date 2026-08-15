// icons/icon.registry.ts

const ICON_REGISTRY = {
  'calendar-1': () => import('./lucide/calendar-1'),
  'calendar-check-2': () => import('./lucide/calendar-check-2'),
  'calendar-x-2': () => import('./lucide/calendar-x-2'),
  'chevron-left': () => import('./lucide/chevron-left'),
  'circle-check': () => import('./lucide/circle-check'),
  'circle-fading-arrow-up': () => import('./lucide/circle-fading-arrow-up'),
  calendar: () => import('./lucide/calendar'),
  check: () => import('./lucide/check'),
  circle: () => import('./lucide/circle'),
  clock: () => import('./lucide/clock'),
  folder: () => import('./lucide/folder'),
  list: () => import('./lucide/list'),
  search: () => import('./lucide/search'),
} as const;

export type IconName = keyof typeof ICON_REGISTRY;
const ICON_LIST = Object.keys(ICON_REGISTRY) as IconName[];
export { ICON_LIST, ICON_REGISTRY };
