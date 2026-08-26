interface SuccessResponse<T> {
  ok: true;
  data: T;
}

interface ErrorResponse {
  ok: false;
  error?: unknown;
  message: string
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
        data: fn()
      };
    } catch (e) {
      console.error(origin, e);
      if (error) error(e);
      return {
        ok: false,
        error: e,
        message: "Ocurrio un error"
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
        message: "Ocurrio un error"
      };
    }
  }
}
