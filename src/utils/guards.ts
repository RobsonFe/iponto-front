/**
 * Narrows an unknown value to a plain object.
 *
 * @param value Value of unknown shape, usually part of an API payload.
 * @returns `false` for primitives, `null` and arrays.
 */
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Narrows an unknown value to a string.
 *
 * @param value Value of unknown shape.
 * @returns `true` for any string, including the empty one.
 */
export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Narrows a value of a nullable, optional text field.
 *
 * @param value Value of unknown shape.
 * @returns `true` for a string, `null` or `undefined`.
 */
export const isOptionalString = (value: unknown): value is string | null | undefined =>
  value === undefined || value === null || isString(value);

/**
 * Narrows an unknown value to a record count.
 *
 * @param value Value of unknown shape.
 * @returns `true` for a safe integer equal to or greater than zero.
 */
export const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
