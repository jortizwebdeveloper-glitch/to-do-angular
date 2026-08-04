// icons/icon.registry.ts

const ICON_REGISTRY = {
  list: () => import('./lucide/list'),
  clock: () => import('./lucide/clock'),
  check: () => import('./lucide/check'),
  calendar: () => import('./lucide/calendar'),
  'calendar-1': () => import('./lucide/calendar-1'),
  'calendar-x-2': () => import('./lucide/calendar-x-2'),
  'calendar-check-2': () => import('./lucide/calendar-check-2'),
  search: () => import('./lucide/search'),
  folder: () => import('./lucide/folder'),
  circle: () => import('./lucide/circle'),
  'circle-fading-arrow-up': () => import('./lucide/circle-fading-arrow-up'),
  'circle-check': () => import('./lucide/circle-check'),
} as const;

export type IconName = keyof typeof ICON_REGISTRY;
const ICON_LIST = Object.keys(ICON_REGISTRY) as IconName[];
export { ICON_REGISTRY, ICON_LIST };
