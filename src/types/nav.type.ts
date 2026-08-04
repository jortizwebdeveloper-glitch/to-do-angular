import { IconName } from '@/app/components/01-atoms/icon/icon.registry';
import { TColors } from '@/shared/theme/color.registry';

export type TNavasideItem = {
  id: number | string;
  icon?: IconName;
  name: string;
  color: TColors;
  link?: {
    path?: string;
    query?: Record<string, string> | null;
  };
  count?: number;
};

export type TNavaside = {
  title: string;
  items: TNavasideItem[] | Record<string, TNavasideItem>;
};
