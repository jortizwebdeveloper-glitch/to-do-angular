import { DEFAULT_DIALOG_CONFIG } from '@angular/cdk/dialog';
import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: DEFAULT_DIALOG_CONFIG,
      useValue: { hasBackdrop: true, backdropClass: ['backdrop-blur', 'bg-black/50'] },
    },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
  ],
};
