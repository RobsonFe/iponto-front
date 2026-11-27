import 'server-only';
import { buildItemPath, buildListPath, isNotFound, parsePayload } from '@/services/api/resource';
import { apiRequest } from '@/services/api/server-client';
import {
  isCompany,
  isCompanyList,
  toCompany,
  type Company,
  type CreateCompanyInput,
  type UpdateCompanyInput,
} from '@/types/company';
import type { PaginationParams } from '@/types/pagination';
import { isCount } from '@/utils/guards';

/**
 * Lists companies, oldest first.
 *
 * @param pagination Page to read. Without it every company is returned.
 * @returns The companies of the page, possibly none.
 * @throws {ApiError} On a backend failure or an unexpected payload.
 */
export const listCompanies = async (pagination?: PaginationParams): Promise<Company[]> => {
  const body = await apiRequest(buildListPath('company', pagination));

  return parsePayload(body, isCompanyList, 'company list').map(toCompany);
};

/**
 * Finds a company.
 *
 * @param id UUID of the company.
 * @returns The company, or `null` when it does not exist or the identifier is not a UUID.
 * @throws {ApiError} On any other backend failure or an unexpected payload.
 */
export const findCompany = async (id: string): Promise<Company | null> => {
  try {
    const body = await apiRequest(buildItemPath('company', 'find', id));

    return toCompany(parsePayload(body, isCompany, 'company'));
  } catch (error) {
    if (isNotFound(error)) {
      return null;
    }

    throw error;
  }
};

/**
 * Registers a company.
 *
 * @param input Data of the new company. The backend rejects unknown fields.
 * @returns The created company.
 * @throws {ApiError} With status 400 for invalid data and 409 when the CNPJ or e-mail is already registered.
 */
export const createCompany = async (input: CreateCompanyInput): Promise<Company> => {
  const body = await apiRequest('/company/save', { method: 'POST', body: JSON.stringify(input) });

  return toCompany(parsePayload(body, isCompany, 'company'));
};

/**
 * Changes the fields sent of a company.
 *
 * @param id UUID of the company.
 * @param input Fields to change.
 * @returns The updated company.
 * @throws {ApiError} With status 400 for invalid data, 404 when the company does not exist and 409 when the
 * CNPJ or e-mail belongs to another company.
 */
export const updateCompany = async (id: string, input: UpdateCompanyInput): Promise<Company> => {
  const body = await apiRequest(buildItemPath('company', 'update', id), {
    method: 'PATCH',
    body: JSON.stringify(input),
  });

  return toCompany(parsePayload(body, isCompany, 'company'));
};

/**
 * Deletes a company and, in cascade, its employees.
 *
 * @param id UUID of the company.
 * @throws {ApiError} With status 404 when the company does not exist.
 */
export const deleteCompany = async (id: string): Promise<void> => {
  await apiRequest(buildItemPath('company', 'delete', id), { method: 'DELETE' });
};

/**
 * Counts the registered companies.
 *
 * @returns The total, used together with {@link listCompanies} to paginate.
 * @throws {ApiError} On a backend failure or an unexpected payload.
 */
export const countCompanies = async (): Promise<number> => {
  const body = await apiRequest('/company/count');

  return parsePayload(body, isCount, 'company count');
};
