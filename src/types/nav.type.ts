import { IconName } from "@/app/components/01-atoms/icon/icon.registry";
import { TColors } from "@/shared/theme/color.registry";

export type TNavasideItems = {
  id: number;
  icon?: IconName;
  name: string;
  color: TColors;
  link?: {
    path?: string;
    query?: Record<string, string> | null;
  };
};

export type TNavaside = {
  title: string;
  items: TNavasideItems[];
};
