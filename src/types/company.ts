import { isAddress, toAddress, type Address } from '@/types/address';
import { isOptionalString, isRecord, isString } from '@/utils/guards';

/** Body of `POST company/save`. */
export interface CreateCompanyInput {
  nome: string;
  cnpj: string;
  email: string;
  phone: string;
  site?: string | null;
  endereco: Address;
}

/** Body of `PATCH company/update/:id`: only the fields sent are changed. A sent address replaces the whole one. */
export type UpdateCompanyInput = Partial<CreateCompanyInput>;

/** Company returned by iponto-api. */
export interface Company extends CreateCompanyInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Checks whether a value matches the {@link Company} contract.
 *
 * @param value API payload.
 * @returns `true` when every required field has the expected type.
 */
export const isCompany = (value: unknown): value is Company =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.nome) &&
  isString(value.cnpj) &&
  isString(value.email) &&
  isString(value.phone) &&
  isOptionalString(value.site) &&
  isAddress(value.endereco) &&
  isString(value.createdAt) &&
  isString(value.updatedAt);

/**
 * Checks whether a value is a list made only of companies.
 *
 * @param value API payload.
 * @returns `true` for an array, possibly empty, in which every item is a {@link Company}.
 */
export const isCompanyList = (value: unknown): value is Company[] => Array.isArray(value) && value.every(isCompany);

/**
 * Copies only the contract fields of a company, so that unknown backend fields are not passed on.
 *
 * @param company Validated company.
 * @returns A new object with the fields of {@link Company}.
 */
export const toCompany = (company: Company): Company => {
  const { id, nome, cnpj, email, phone, site, endereco, createdAt, updatedAt } = company;

  return { id, nome, cnpj, email, phone, site, endereco: toAddress(endereco), createdAt, updatedAt };
};
