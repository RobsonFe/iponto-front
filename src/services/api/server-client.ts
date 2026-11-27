import 'server-only';
import { unstable_rethrow } from 'next/navigation';

const REQUEST_TIMEOUT_MS = 10_000;

/** Error of a backend call, carrying the HTTP status. Its message is technical: never show it to the user. */
export class ApiError extends Error {
  /**
   * @param status HTTP status of the failure: 503 when the backend could not be reached, 502 when its answer
   * could not be understood.
   * @param message Technical description kept on the server.
   * @param options Standard error options, such as the original `cause`.
   */
  constructor(
    readonly status: number,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'ApiError';
  }
}

const getBaseUrl = (): string => {
  const url = process.env.API_URL;

  if (!url) {
    throw new Error('API_URL is not configured');
  }

  return url.replace(/\/+$/, '');
};

const readJson = async (response: Response, failure: string): Promise<unknown> => {
  let text: string;

  try {
    text = await response.text();
  } catch (error) {
    unstable_rethrow(error);
    throw new ApiError(503, failure, { cause: error });
  }

  try {
    return JSON.parse(text);
  } catch {
    // No `cause`: the parser message quotes the body, which may carry personal data into server logs.
    throw new ApiError(502, failure);
  }
};

/**
 * Sends a request to iponto-api. This is the only place that knows the backend URL.
 *
 * @param path Route below the API prefix, starting with `/`. It must not carry personal data, because it
 * appears in error messages.
 * @param init Options of `fetch`. Without a `signal`, the request is aborted after 10 seconds.
 * @returns The parsed body as `unknown`, or `undefined` for `204`.
 * @throws {ApiError} With the response status when it is not successful, 503 when the backend is unreachable or
 * the body is interrupted, and 502 when the body is not JSON.
 * @throws {Error} When `API_URL` is not configured.
 */
export const apiRequest = async (path: string, init: RequestInit = {}): Promise<unknown> => {
  const url = `${getBaseUrl()}${path}`;
  const failure = `Backend request failed: ${init.method ?? 'GET'} ${path}`;
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  if (init.body) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      headers,
      signal: init.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    // Next.js signals prerender bailouts and redirects by throwing: those must not become API errors.
    unstable_rethrow(error);
    throw new ApiError(503, failure, { cause: error });
  }

  if (!response.ok) {
    // An unread body keeps the connection busy. A failure to release it must not replace the HTTP status.
    const releaseFailure = await response.body?.cancel().catch((reason: unknown) => reason);
    throw new ApiError(response.status, failure, { cause: releaseFailure });
  }

  return response.status === 204 ? undefined : readJson(response, failure);
};
