import { filterByDate, formatDate, getDate, keyDate, overDue } from './date';

/**
 * Construye "YYYY/MM/DD" a partir de las partes **locales** de una fecha, que es el
 * formato en el que la app persiste `dueDate`/`completeDate` (ver `task.dto.ts`).
 * Nunca usar `toISOString()` acá: es UTC y corre el día en cualquier zona con offset
 * negativo.
 */
function localDay(offset = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * Corre `fn` como si el navegador estuviera en `timeZone`, y restaura la zona real.
 *
 * `process` no está tipado acá (el tsconfig de specs no incluye `@types/node`), así que se
 * accede por `globalThis` en vez de sumar la dependencia solo para esto.
 */
function inTimeZone(timeZone: string, fn: () => void) {
  const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process
    ?.env;
  const original = env?.['TZ'];
  if (env) env['TZ'] = timeZone;
  try {
    fn();
  } finally {
    if (env) env['TZ'] = original;
  }
}

describe('date utils', () => {
  describe('formatDate', () => {
    it('devuelve el día del calendario en formato YYYY/MM/DD', () => {
      expect(formatDate('2026/09/20')).toBe('2026/09/20');
    });

    it('acepta una fecha con guiones y la normaliza a barras', () => {
      expect(formatDate('2026-09-20')).toBe('2026/09/20');
    });

    it('sin argumentos, devuelve el día de hoy', () => {
      expect(formatDate()).toBe(localDay());
    });

    it('es idempotente: formatear dos veces no corre la fecha', () => {
      expect(formatDate(formatDate('2026/09/20'))).toBe('2026/09/20');
    });

    it('respeta el día local del usuario, no el de una zona horaria fija', () => {
      // 00:30 del 14 en hora local: en cualquier zona, el día local es el 14.
      inTimeZone('Europe/Madrid', () => {
        expect(formatDate(new Date(2026, 8, 14, 0, 30).getTime())).toBe('2026/09/14');
      });
      inTimeZone('Asia/Tokyo', () => {
        expect(formatDate(new Date(2026, 8, 14, 0, 30).getTime())).toBe('2026/09/14');
      });
    });
  });

  describe('keyDate', () => {
    it('reconoce hoy, ayer y mañana', () => {
      expect(keyDate(localDay(0))).toBe('today');
      expect(keyDate(localDay(-1))).toBe('yesterday');
      expect(keyDate(localDay(1))).toBe('tomorrow');
    });

    it('devuelve null para fechas fuera de esa ventana', () => {
      expect(keyDate(localDay(2))).toBeNull();
      expect(keyDate(localDay(-30))).toBeNull();
    });
  });

  describe('overDue', () => {
    it('una fecha pasada está vencida; hoy y el futuro no', () => {
      expect(overDue(localDay(-1))).toBe(true);
      expect(overDue(localDay(0))).toBe(false);
      expect(overDue(localDay(1))).toBe(false);
    });
  });

  describe('filterByDate', () => {
    it('clasifica según la fecha cuando la tarea no está finalizada', () => {
      expect(filterByDate(localDay(0), false)).toBe('hoy');
      expect(filterByDate(localDay(5), false)).toBe('proximas');
      expect(filterByDate(localDay(-5), false)).toBe('vencidas');
    });

    it('una tarea finalizada cae en "finalizadas" sin importar la fecha', () => {
      expect(filterByDate(localDay(-5), true)).toBe('finalizadas');
      expect(filterByDate(localDay(5), true)).toBe('finalizadas');
    });
  });

  describe('getDate', () => {
    it('para hoy, devuelve la etiqueta "Hoy" con el color del día y sin vencer', () => {
      const result = getDate(localDay(0), 'pendiente');

      expect(result.label).toBe('Hoy');
      expect(result.overDue).toBe(false);
      expect(result.color?.key).toBe('blue');
    });

    it('para una fecha vencida e incompleta, marca overDue y pinta en rojo', () => {
      const result = getDate(localDay(-3), 'pendiente');

      expect(result.overDue).toBe(true);
      expect(result.color?.key).toBe('red');
    });

    it('una tarea completada nunca se marca como vencida, aunque la fecha haya pasado', () => {
      const result = getDate(localDay(-3), 'completada');

      expect(result.overDue).toBe(false);
      expect(result.incomplete).toBe(false);
      expect(result.color?.key).toBe('emerald');
    });

    it('para una fecha lejana, la etiqueta es la fecha cruda y no hay color', () => {
      const result = getDate(localDay(30), 'pendiente');

      expect(result.label).toBe(localDay(30));
      expect(result.color).toBeNull();
    });

    it('con fecha vacía no explota: devuelve la fecha cruda sin color', () => {
      const result = getDate('', 'pendiente');

      expect(result.label).toBe('');
      expect(result.color).toBeNull();
    });
  });

  /**
   * Regresión del bug de zona horaria: `formatDate` normalizaba con
   * `timeZone: 'America/Bogota'` hardcodeado, mientras que la comparación usaba la
   * medianoche local del navegador. Fuera de Bogotá los dos relojes no coincidían y una
   * tarea creada para hoy se guardaba —y se mostraba— como "Ayer", pintada de vencida.
   */
  describe('consistencia entre zonas horarias', () => {
    const zonas = [
      'America/Bogota',
      'Europe/Madrid',
      'Asia/Tokyo',
      'America/Los_Angeles',
      'Pacific/Kiritimati',
    ];

    it.each(zonas)('en %s, una tarea creada para hoy se muestra como "Hoy"', (zona) => {
      inTimeZone(zona, () => {
        // Flujo real: el usuario elige hoy en el date picker → el DTO lo normaliza con
        // formatDate → Card lo muestra con getDate.
        const elegidoEnElPicker = localDay(0);
        const guardado = formatDate(elegidoEnElPicker);
        const mostrado = getDate(guardado, 'pendiente');

        expect(guardado).toBe(elegidoEnElPicker);
        expect(mostrado.label).toBe('Hoy');
        expect(mostrado.overDue).toBe(false);
      });
    });

    it.each(zonas)('en %s, el filtro del sidebar clasifica hoy como "hoy"', (zona) => {
      inTimeZone(zona, () => {
        expect(filterByDate(formatDate(localDay(0)), false)).toBe('hoy');
      });
    });
  });
});
