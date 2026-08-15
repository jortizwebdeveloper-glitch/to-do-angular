import { Component, output } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form-control.html',
})
export class FormControl {
  submitHandle = output();
  
  onSubmit(e: Event) {
    e.preventDefault();
    this.submitHandle.emit();
  }
}
