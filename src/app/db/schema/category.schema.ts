export const CATEGORIES_TABLE = 'categories';

export type CategoryRow = {
  id: number;
  name: string;
  color: string;
};

export const CATEGORY_INDEXED = '++id, name, color';
