import { isOptionalString, isRecord, isString } from '@/utils/guards';

/** Address of a company or employee, as stored by iponto-api. */
export interface Address {
  rua: string;
  numero?: string | null;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

/**
 * Checks whether a value matches the {@link Address} contract.
 *
 * @param value Part of an API payload.
 * @returns `true` when every required field is a string and the optional ones are text or empty.
 */
export const isAddress = (value: unknown): value is Address =>
  isRecord(value) &&
  isString(value.rua) &&
  isOptionalString(value.numero) &&
  isOptionalString(value.complemento) &&
  isString(value.bairro) &&
  isString(value.cidade) &&
  isString(value.estado) &&
  isString(value.cep);

/**
 * Copies only the contract fields of an address, so that unknown backend fields are not passed on.
 *
 * @param address Validated address.
 * @returns A new object with the fields of {@link Address}.
 */
export const toAddress = ({ rua, numero, complemento, bairro, cidade, estado, cep }: Address): Address => ({
  rua,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
  cep,
});
