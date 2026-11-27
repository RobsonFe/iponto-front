/**
 * Page of a list route. Both fields travel together: given a page without a limit,
 * iponto-api returns every record from the offset on.
 */
export interface PaginationParams {
  /** Starts at 1. The backend currently rejects values above 50. */
  page: number;
  /** Records per page, at least 1. */
  limit: number;
}
