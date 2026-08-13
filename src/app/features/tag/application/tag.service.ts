import { computed, inject, Service } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TagRepository } from '../infraestructure/tag.repository.dexie';
import { TagViewModel } from './tag-view.model';

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
