import type { Meta, StoryObj } from '@storybook/angular';

import { GeneralLayout } from './general-layout';

/**
 * `app-general-layout` es la estructura base de la app: un `<aside>` fijo
 * (logo + título "TaskFlow", contenido scrolleable y footer) y un `<main>`
 * a la derecha. No recibe `@Input()`s — todo llega vía `ng-content` con tres
 * selectores: `[aside-content]`, `[aside-footer]` y `[main-content]`. Uso
 * real en `dashboard-layout.html` (navasides + botón "Crear tarea" +
 * `router-outlet`).
 */
const meta: Meta<GeneralLayout> = {
  title: 'Layout/GeneralLayout',
  component: GeneralLayout,
  tags: ['autodocs'],
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
  render: () => ({
    template: `
      <div style="height:400px">
        <app-general-layout>
          <nav aside-content style="display:flex;flex-direction:column;gap:8px">
            <a style="padding:8px 12px;border-radius:8px;background:rgba(0,0,0,.05)">Todas</a>
            <a style="padding:8px 12px">Categorías</a>
            <a style="padding:8px 12px">Tags</a>
          </nav>
          <button aside-footer style="width:100%;padding:8px;border-radius:8px;background:#10b981;color:white">
            Crear tarea
          </button>
          <div main-content style="padding:24px">
            <h2>Contenido principal</h2>
            <p>Acá se proyecta el <code>router-outlet</code> real.</p>
          </div>
        </app-general-layout>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<GeneralLayout>;

/** Estructura completa: aside con navegación + footer, y main con contenido. */
export const Default: Story = {};
