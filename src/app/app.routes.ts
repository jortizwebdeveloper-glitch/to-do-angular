import type { Routes } from '@angular/router';

import { taxonomyGuard } from './core/guards/taxonomy.guard';
import { DashboardLayout, DashboardPage } from './presentation/pages/dashboard';
import { CreateTaskPage } from './presentation/pages/dashboard/children/create-task/page/create-task-page';
import { TaskPage } from './presentation/pages/dashboard/children/task';
import { HomePage } from './presentation/pages/home';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        component: DashboardPage,
        canActivate: [taxonomyGuard],
        children: [
          {
            path: "create-task",
            component: CreateTaskPage
          },
          {
            path: 'task/:id',
            component: TaskPage,
          },
        ],
      },
    ],
  },
];
