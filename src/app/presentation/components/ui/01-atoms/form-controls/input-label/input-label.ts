import { Component, input } from '@angular/core';
import type { ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'app-input-label',
  templateUrl: './input-label.html',
})
export class InputLabel {
  invalid = input<boolean>(false);
  label = input<string>();
  errors = input<readonly ValidationError[]>([]);
}
