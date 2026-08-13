import { Routes } from '@angular/router';
import { Home } from './components/05-page/home/home';
import { Dashboard } from './components/05-page/dashboard/dashboard';
import { Tasks } from './components/05-page/tasks/tasks';
import { GeneralLayout } from './components/04-layout/general-layout/general-layout';
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
