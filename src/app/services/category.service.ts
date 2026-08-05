import { computed, inject, Service } from '@angular/core';
import { CategoryRepository } from '../repository/category/category.repository';
import { rxResource } from '@angular/core/rxjs-interop';
import { TCategory } from '@/types/task.type';

@Service()
export class CategoryService {
  categoryRepository = inject(CategoryRepository);
  categoryResoruce = rxResource({
    stream: () => this.categoryRepository.getCategories(),
  });
  $categories = computed(() => this.categoryResoruce.value() as TCategory[] | undefined);
}
