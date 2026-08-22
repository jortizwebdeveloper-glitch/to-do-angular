import { computed, inject, Service } from '@angular/core';
import { CategoryService } from '@app/features/category';
import { TagService } from '@app/features/tag';
import { PRIORITY_TASK, PRIORITY_TASK_VALUES } from '@app/features/task';

@Service()
export class OptionsService {
  categoryService = inject(CategoryService);
  tagService = inject(TagService);

  categoryOptions = computed(() =>
    this.categoryService.$categoryArray().map((i) => ({ label: i.name, value: i.id })),
  );
  tagOptions = computed(() =>
    this.tagService.$tagArray().map((i) => ({ label: i.name, value: i.id })),
  );
  priorityOptions = computed(() =>
    PRIORITY_TASK_VALUES.map((key) => ({ label: PRIORITY_TASK[key], value: key })),
  );
}
