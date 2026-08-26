import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { TaskService } from '@app/features/task/application/task.service';

export const taskGuard: CanActivateFn = async (route) => {
  const taskService = inject(TaskService);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  const has = await taskService.hasOwnTask(Number(id));
  return has ? true : router.createUrlTree(['dashboard']);
};
