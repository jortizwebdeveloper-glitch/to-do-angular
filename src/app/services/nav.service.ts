import { TNavaside } from '@/types/nav.type';
import { computed, inject, Service, signal } from '@angular/core';
import { CategoryService } from './category.service';
import { TagService } from './tag.service';

@Service()
export class NavService {
  private categoriesService = inject(CategoryService);
  private tagsService = inject(TagService);

  date_menu = signal<TNavaside>({
    title: 'Visita',
    items: {
      hoy: {
        id: 1,
        icon: 'calendar-1',
        name: 'Hoy',
        color: 'blue',
        link: {
          query: {
            fecha: 'hoy',
          },
        },
        count: 0,
      },
      proximas: {
        id: 2,
        icon: 'calendar',
        name: 'Proximas',
        color: 'yellow',
        link: {
          query: {
            fecha: 'proximas',
          },
        },
        count: 0,
      },
      vencidas: {
        id: 3,
        icon: 'calendar-x-2',
        name: 'Vencidas',
        color: 'red',
        link: {
          query: {
            fecha: 'vencidas',
          },
        },
        count: 0,
      },
      finalizadas: {
        id: 4,
        icon: 'calendar-check-2',
        name: 'Finalizadas',
        color: 'emerald',
        link: {
          query: {
            fecha: 'finalizadas',
          },
        },
        count: 0,
      },
    },
  });

  categories_menu = computed<TNavaside>(() => ({
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
      ...(this.categoriesService.$categories()?.map((cat) => ({
        ...cat,
        link: {
          query: {
            categoria: String(cat.id),
          },
        },
      })) ?? []),
    ],
  }));

  tags_menu = computed<TNavaside>(() => ({
    title: 'Tags',
    items: [
      {
        id: 0,
        name: 'Todo',
        color: 'blue',
        link: {
          query: {
            tag: 'all',
          },
        },
      },
      ...(this.tagsService.$tags()?.map((tag) => ({
        ...tag,
        link: {
          query: {
            tag: String(tag.id),
          },
        },
      })) ?? []),
    ],
  }));
}
