import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';

import { taxonomyGuard } from './taxonomy.guard';

@Component({ imports: [RouterOutlet], template: '<router-outlet />' })
class RootStub {}

@Component({ template: 'dashboard' })
class PageStub {}

/**
 * `taxonomyGuard` garantiza que el dashboard siempre tenga los cuatro filtros en la URL:
 * si falta alguno, redirige a la misma ruta completándolo con su valor por defecto. Sin eso,
 * `DashboardPage` filtraría contra `undefined` y no mostraría nada.
 */
describe('taxonomyGuard', () => {
  let router: Router;

  /** Query params de la URL actual, como objeto (evita depender del orden en el string). */
  const queryParams = () => router.parseUrl(router.url).queryParams;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'dashboard', component: PageStub, canActivate: [taxonomyGuard] }]),
      ],
    });

    router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(RootStub);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deja pasar sin redirigir cuando están los cuatro filtros', async () => {
    const url = '/dashboard?categoria=1&tag=2&estado=pendiente&fecha=proximas';

    const navegó = await router.navigateByUrl(url);

    expect(navegó).toBe(true);
    expect(queryParams()).toEqual({
      categoria: '1',
      tag: '2',
      estado: 'pendiente',
      fecha: 'proximas',
    });
  });

  it('sin ningún filtro, redirige completando los cuatro por defecto', async () => {
    await router.navigateByUrl('/dashboard');

    expect(queryParams()).toEqual({
      categoria: 'all',
      tag: 'all',
      estado: 'all',
      fecha: 'hoy',
    });
  });

  it('completa solo los que faltan y respeta los que ya venían', async () => {
    await router.navigateByUrl('/dashboard?categoria=3&fecha=vencidas');

    expect(queryParams()).toEqual({
      categoria: '3', // se respeta
      fecha: 'vencidas', // se respeta
      tag: 'all', // se completa
      estado: 'all', // se completa
    });
  });

  it('conserva query params ajenos al conjunto de filtros, como la búsqueda', async () => {
    await router.navigateByUrl('/dashboard?search=pan');

    expect(queryParams()).toEqual({
      search: 'pan',
      categoria: 'all',
      tag: 'all',
      estado: 'all',
      fecha: 'hoy',
    });
  });

  it('un filtro con valor vacío cuenta como presente y no se pisa', async () => {
    await router.navigateByUrl('/dashboard?categoria=&tag=all&estado=all&fecha=hoy');

    expect(queryParams()['categoria']).toBe('');
  });
});
