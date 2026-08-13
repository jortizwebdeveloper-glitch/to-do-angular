export const TAGS_TABLE = 'tags';

export interface TagRow {
  id: number;
  name: string;
  color: string;
}

export const TAG_INDEXED = '++id, name, color';
