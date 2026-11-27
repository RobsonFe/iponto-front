import 'server-only';
import { buildItemPath, buildListPath, isNotFound, parsePayload } from '@/services/api/resource';
import { apiRequest } from '@/services/api/server-client';
import {
  isEmployee,
  isEmployeeList,
  toEmployee,
  type CreateEmployeeInput,
  type Employee,
  type UpdateEmployeeInput,
} from '@/types/employee';
import type { PaginationParams } from '@/types/pagination';
import { isCount } from '@/utils/guards';

/**
 * Lists employees, oldest first. The company of each employee is not returned.
 *
 * @param pagination Page to read. Without it every employee is returned.
 * @returns The employees of the page, possibly none.
 * @throws {ApiError} On a backend failure or an unexpected payload.
 */
export const listEmployees = async (pagination?: PaginationParams): Promise<Employee[]> => {
  const body = await apiRequest(buildListPath('employee', pagination));

  return parsePayload(body, isEmployeeList, 'employee list').map(toEmployee);
};

/**
 * Finds an employee. The company of the employee is not returned.
 *
 * @param id UUID of the employee.
 * @returns The employee, or `null` when it does not exist or the identifier is not a UUID.
 * @throws {ApiError} On any other backend failure or an unexpected payload.
 */
export const findEmployee = async (id: string): Promise<Employee | null> => {
  try {
    const body = await apiRequest(buildItemPath('employee', 'find', id));

    return toEmployee(parsePayload(body, isEmployee, 'employee'));
  } catch (error) {
    if (isNotFound(error)) {
      return null;
    }

    throw error;
  }
};

/**
 * Registers an employee in a company.
 *
 * @param input Data of the new employee. The backend rejects unknown fields.
 * @returns The created employee.
 * @throws {ApiError} With status 400 for invalid data, 404 when the company does not exist and 409 when the
 * CPF or e-mail is already registered.
 */
export const createEmployee = async (input: CreateEmployeeInput): Promise<Employee> => {
  const body = await apiRequest('/employee/save', { method: 'POST', body: JSON.stringify(input) });

  return toEmployee(parsePayload(body, isEmployee, 'employee'));
};

/**
 * Updates an employee. Every field is required except the address.
 *
 * @param id UUID of the employee.
 * @param input New data of the employee.
 * @returns The updated employee.
 * @throws {ApiError} With status 400 for invalid data, 404 when the employee or the company does not exist and
 * 409 when the CPF or e-mail belongs to another employee.
 */
export const updateEmployee = async (id: string, input: UpdateEmployeeInput): Promise<Employee> => {
  const body = await apiRequest(buildItemPath('employee', 'update', id), {
    method: 'PATCH',
    body: JSON.stringify(input),
  });

  return toEmployee(parsePayload(body, isEmployee, 'employee'));
};

/**
 * Deletes an employee.
 *
 * @param id UUID of the employee.
 * @throws {ApiError} With status 404 when the employee does not exist.
 */
export const deleteEmployee = async (id: string): Promise<void> => {
  await apiRequest(buildItemPath('employee', 'delete', id), { method: 'DELETE' });
};

/**
 * Counts the registered employees.
 *
 * @returns The total, used together with {@link listEmployees} to paginate.
 * @throws {ApiError} On a backend failure or an unexpected payload.
 */
export const countEmployees = async (): Promise<number> => {
  const body = await apiRequest('/employee/count');

  return parsePayload(body, isCount, 'employee count');
};
