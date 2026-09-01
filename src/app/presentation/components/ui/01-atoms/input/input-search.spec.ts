import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { InputSearch } from './input-search';

describe('Input', () => {
  let component: InputSearch;
  let fixture: ComponentFixture<InputSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(InputSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
