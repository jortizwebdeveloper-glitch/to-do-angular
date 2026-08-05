import { TestBed } from '@angular/core/testing';

import { TaskRepository } from './task.repository';

describe('TaskRepository', () => {
  let service: TaskRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
