import { TestBed } from '@angular/core/testing';

import { TagRepository } from './tag.repository';

describe('TagRepository', () => {
  let service: TagRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
