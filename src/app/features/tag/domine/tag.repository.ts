import type { Observable } from 'rxjs';
import type { TagEntity } from './tag.entity';

export interface ITagRepository {
  getAll(): Observable<TagEntity[]>;
}
