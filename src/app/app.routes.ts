import { Routes } from '@angular/router';
import { Home } from './components/page/home/home';
import { Dashboard } from './components/page/dashboard/dashboard';
import { Tasks } from './components/page/tasks/tasks';
import { GeneralLayout } from './components/layout/general-layout/general-layout';

export const routes: Routes = [{
    path: "",
    component: Home
}, {
    path: "dashboard",
    component: GeneralLayout,
    children: [
        {
            path: "",
            component: Dashboard
        },
        {
            path: "tasks",
            component: Tasks
        }
    ]
}];
