// icons/icon.component.ts
import { Component, inject, input, resource } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICON_REGISTRY, IconName } from './icon.registry';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
})
export class Icon {
  // ✅ input() signal en lugar de @Input() decorator
  name = input.required<IconName>();

  private sanitizer = inject(DomSanitizer);

  // ✅ resource() stable en v22 — maneja el ciclo async + reactivity automáticamente
  protected icon = resource({
    params: () => ({ name: this.name() }), // se re-ejecuta automáticamente si `name` cambia
    loader: async ({ params: { name } }) => {
      const loader = ICON_REGISTRY[name];
      if (!loader) {
        throw new Error(`Icon "${name}" not found in registry`);
      }
      const { default: raw } = await loader();
      // bypassSecurityTrustHtml sigue siendo necesario para SVG inline
      // es seguro porque la fuente son nuestros propios archivos .ts generados
      return this.sanitizer.bypassSecurityTrustHtml(raw);
    },
  });
}
