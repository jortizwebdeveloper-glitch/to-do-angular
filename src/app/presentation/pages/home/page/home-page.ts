import { Component, signal } from '@angular/core';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email('Ingresa un emial valido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
});

type TLogin = z.infer<typeof loginSchema>;

@Component({
  selector: 'app-home',
  imports: [FormField],
  templateUrl: './home-page.html',
})
export class HomePage {
  fields = signal<TLogin>({ email: '', password: '' });
  form = form(this.fields, (f) => {
    validateStandardSchema(f, loginSchema);
  });

  onSubmit(e: Event) {
    e.preventDefault();
    console.log(this.form().valid(), this.form().value());
  }
}
