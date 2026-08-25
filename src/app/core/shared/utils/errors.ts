interface SuccessResponse<T> {
  ok: true;
  data: T;
}

interface ErrorResponse {
  ok: false;
  error?: unknown;
}

export class ControllerException {
  validate<T>(
    fn: () => T,
    origin: string,
    error?: (e: unknown) => void,
  ): SuccessResponse<T> | ErrorResponse {
    try {
      return {
        ok: true,
        data: fn(),
      };
    } catch (e) {
      console.error(origin, e);
      if (error) error(e);
      return {
        ok: false,
        error: e,
      };
    }
  }
  async validateAsync<T>(
    fn: () => Promise<T>,
    origin: string,
    error?: (e: unknown) => void,
  ): Promise<SuccessResponse<T> | ErrorResponse> {
    try {
      const data = await fn();
      return {
        ok: true,
        data,
      };
    } catch (e) {
      console.error(origin, e);
      if (error) error(e);
      return {
        ok: false,
        error: e,
      };
    }
  }
}
