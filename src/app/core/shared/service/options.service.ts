import { computed, inject, Service } from '@angular/core';
import { CategoryService } from '@app/features/category';
import { TagService } from '@app/features/tag';

/**
 * Opciones que se derivan del estado reactivo de otras features. Las que salen de un enum
 * (`STATUS_OPTIONS`, `PRIORITY_OPTIONS`) son constantes exportadas desde `features/task`, y
 * las operaciones sobre tareas viven en `TaskStore`: acá solo quedan las opciones.
 */
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

}
