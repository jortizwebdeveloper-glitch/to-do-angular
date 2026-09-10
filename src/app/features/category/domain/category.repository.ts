import type { Observable } from 'rxjs';

import type { CategoryEntity } from './category.entity';

export interface ICategoryRepository {
  getAll(): Observable<CategoryEntity[]>;
}
