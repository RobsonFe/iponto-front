// Same format accepted by `ParseUUIDPipe` in iponto-api: any UUID version.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Checks whether a value has the format of a UUID.
 *
 * @param value Identifier received from an untrusted source.
 * @returns `true` only when the whole value is a UUID.
 */
export const isUuid = (value: string): boolean => UUID_PATTERN.test(value);
