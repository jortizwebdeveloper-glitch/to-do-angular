import { computed, inject, Service } from '@angular/core';
import { TagRepository } from '../repository/tag/tag.repository';
import { rxResource } from '@angular/core/rxjs-interop';
import { TTag } from '@/types/task.type';

@Service()
export class TagService {
  private tagRepository = inject(TagRepository);
  private tagResource = rxResource({
    stream: () => this.tagRepository.getTags(),
  });
  $tags = computed(() => this.tagResource.value() as TTag[] | undefined);
}
