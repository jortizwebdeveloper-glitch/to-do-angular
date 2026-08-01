import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { taxonomyGuard } from './taxonomy-guard';

describe('taxonomyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => taxonomyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
