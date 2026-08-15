import { Component, output } from '@angular/core';

@Component({
  selector: 'app-form-handle',
  templateUrl: './form-handle.html',
})
export class FormHandle {
  submitHandle = output();
  
  onSubmit(e: Event) {
    e.preventDefault();
    this.submitHandle.emit();
  }
}
