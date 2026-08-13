import type { Routes } from '@angular/router';

import { GeneralLayout } from './components/04-layout/general-layout/general-layout';
import { Dashboard } from './components/05-page/dashboard/dashboard';
import { Home } from './components/05-page/home/home';
import { Tasks } from './components/05-page/tasks/tasks';
import { taxonomyGuard } from './core/guards/taxonomy.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'dashboard',
    component: GeneralLayout,
    children: [
      {
        path: '',
        component: Dashboard,
        canActivate: [taxonomyGuard],
        children: [
          {
            path: 'task/:id',
            component: Tasks,
          },
        ]
      },
    ],
  },
];
