import { computed, inject, Service } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TagRepository } from '@app/features/tag/infraestructure/tag.repository.dexie';

import type { TagViewModel } from './tag.view';

@Service()
export class TagService {
  private tagRepository = inject(TagRepository);
  private tagResource = rxResource({
    stream: () => this.tagRepository.getAll(),
  });
  $tags = computed(
    () => new Map((this.tagResource.value() ?? []).map((tag) => [tag!.id, tag! as TagViewModel])),
  );
  $tagArray = computed(() => [...this.$tags().values()]);
}
