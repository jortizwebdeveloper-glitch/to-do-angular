import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { InputText } from './input-date';

describe('InputText', () => {
  let component: InputText;
  let fixture: ComponentFixture<InputText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputText],
    }).compileComponents();

    fixture = TestBed.createComponent(InputText);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
