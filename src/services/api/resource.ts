import 'server-only';
import { ApiError } from '@/services/api/server-client';
import type { PaginationParams } from '@/types/pagination';
import { isUuid } from '@/utils/uuid';

export type ApiResource = 'company' | 'employee';
export type ItemOperation = 'find' | 'update' | 'delete';

/**
 * Builds the path of a list route.
 *
 * @param resource Backend resource.
 * @param pagination Page to read. Without it the backend returns every record.
 * @returns The path, with `page` and `limit` when paginated.
 */
export const buildListPath = (resource: ApiResource, pagination?: PaginationParams): string => {
  if (!pagination) {
    return `/${resource}/list`;
  }

  const query = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });

  return `/${resource}/list?${query}`;
};

/**
 * Builds the path of a route that targets one record. Only a UUID is placed in the path, so an
 * untrusted identifier cannot reach another route.
 *
 * @param resource Backend resource.
 * @param operation Route of the record.
 * @param id Identifier of the record.
 * @returns The path of the route.
 * @throws {ApiError} With status 404 when the identifier is not a UUID, without calling the backend.
 */
export const buildItemPath = (resource: ApiResource, operation: ItemOperation, id: string): string => {
  if (!isUuid(id)) {
    throw new ApiError(404, `Invalid ${resource} id`);
  }

  return `/${resource}/${operation}/${id}`;
};

/**
 * Confirms that a backend answer respects its contract.
 *
 * @param body Parsed answer.
 * @param isExpected Type guard of the contract.
 * @param description Name of the payload, used in the technical message.
 * @returns The same body, now typed.
 * @throws {ApiError} With status 502 when the body does not match. The body is not included in the error.
 */
export const parsePayload = <T>(body: unknown, isExpected: (value: unknown) => value is T, description: string): T => {
  if (!isExpected(body)) {
    throw new ApiError(502, `Unexpected ${description} payload`);
  }

  return body;
};

/**
 * Checks whether an error means that the record does not exist.
 *
 * @param error Value caught from a backend call.
 * @returns `true` only for an {@link ApiError} with status 404.
 */
export const isNotFound = (error: unknown): boolean => error instanceof ApiError && error.status === 404;
