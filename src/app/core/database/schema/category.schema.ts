export const CATEGORIES_TABLE = 'categories';

export interface CategoryRow {
  id: number;
  name: string;
  color: string;
}

export const CATEGORY_INDEXED = '++id, name, color';
