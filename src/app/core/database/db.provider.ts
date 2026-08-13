import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { AppTaskDataBase } from './app.db';

export const APP_DB = new InjectionToken<AppTaskDataBase | null>('APP_DB', {
  providedIn: 'root',
  factory: () => (isPlatformBrowser(inject(PLATFORM_ID)) ? new AppTaskDataBase() : null),
});
