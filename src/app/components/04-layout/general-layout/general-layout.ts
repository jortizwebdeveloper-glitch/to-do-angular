import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navaside } from '@components/02-molecules/navaside/navaside';
import { CategoryService, TagService } from '@/app/services/task.service';
import { TNavaside } from '@/types/nav.type';

@Component({
  selector: 'app-general-layout',
  imports: [RouterOutlet, Navaside],
  templateUrl: './general-layout.html',
  styleUrl: './general-layout.css',
})
export class GeneralLayout {
  categoriesService = inject(CategoryService);
  tagsService = inject(TagService);
  main_menu: TNavaside = {
    title: 'Visita',
    items: [
      {
        id: 1,
        icon: 'clock',
        name: 'Hoy',
        color: 'orange',
        link: {
          query: {
            fecha: 'hoy',
          },
        },
      },
      {
        id: 1,
        icon: 'calendar',
        name: 'Proximas',
        color: 'red',
        link: {
          query: {
            fecha: 'proximas',
          },
        },
      },
      {
        id: 1,
        icon: 'circle-check',
        name: 'Finalizadas',
        color: 'emerald',
        link: {
          query: {
            fecha: 'finalizadas',
          },
        },
      },
    ],
  };
  categories_menu = signal<TNavaside>({
    title: 'Categorías',
    items: [
      {
        id: 0,
        name: 'Todas las categorias',
        color: 'blue',
        link: {
          query: {
            categoria: 'all',
          },
        },
      },
      ...this.categoriesService.categories(),
    ],
  });
  tags_menu = signal<TNavaside>({
    title: 'Tags',
    items: [
      {
        id: 0,
        name: 'Todo',
        color: 'neutral',
        link: {
          query: {
            tag: 'all',
          },
        },
      },
      ...this.tagsService.tags(),
    ],
  });
}
