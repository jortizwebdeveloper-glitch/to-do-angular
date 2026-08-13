import { computed, inject, Service } from '@angular/core';
import { CategoryRepository } from '../infraestructure/category.repository.dexie';
import { rxResource } from '@angular/core/rxjs-interop';
import type { CategoryViewModel } from './category-view.model';

@Service()
export class CategoryService {
  categoryRepository = inject(CategoryRepository);
  categoryResoruce = rxResource({
    stream: () => this.categoryRepository.getAll(),
  });
  $categories = computed(
    () =>
      new Map(
        (this.categoryResoruce.value() ?? []).map((cat) => [
          cat!.id,
          cat! as CategoryViewModel,
        ]),
      ),
  );
  $categoryArray = computed(() => [...this.$categories().values()])
}
