import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { createUrlTreeFromSnapshot } from '@angular/router';

const DEFAULT_QUERY_PARAMS: Record<string, string> = {
  categoria: 'all',
  tag: 'all',
  estado: 'all',
  fecha: 'hoy',
};

export const taxonomyGuard: CanActivateFn = (route) => {
  const platformId = inject(PLATFORM_ID);
  console.log('Guard Server', isPlatformBrowser(platformId));
  const missing = Object.keys(DEFAULT_QUERY_PARAMS).filter((key) => !route.queryParamMap.has(key));

  if (missing.length === 0) {
    return true;
  }

  const params = { ...route.queryParams };
  missing.forEach((key) => (params[key] = DEFAULT_QUERY_PARAMS[key]));

  return createUrlTreeFromSnapshot(route, [], params);
};
