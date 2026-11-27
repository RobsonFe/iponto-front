import { isAddress, toAddress, type Address } from '@/types/address';
import { isOptionalString, isRecord, isString } from '@/utils/guards';

/** Body of `POST employee/save`. */
export interface CreateEmployeeInput {
  nome: string;
  cpf: string;
  email: string;
  phone: string;
  linkedin?: string | null;
  endereco: Address;
  companyId: string;
}

/**
 * Body of `PATCH employee/update/:id`. Unlike the company update, the backend requires every field
 * except the address.
 */
export type UpdateEmployeeInput = Omit<CreateEmployeeInput, 'endereco'> & { endereco?: Address };

/** Company of an employee, as far as the employee routes return it. */
export interface EmployeeCompanyReference {
  id: string;
}

/** Employee returned by iponto-api. */
export interface Employee extends Omit<CreateEmployeeInput, 'companyId'> {
  id: string;
  /** Returned by `save` and `update` only: `find` and `list` omit it. */
  company?: EmployeeCompanyReference;
  createdAt: string;
  updatedAt: string;
}

const isCompanyReference = (value: unknown): value is EmployeeCompanyReference =>
  isRecord(value) && isString(value.id);

/**
 * Checks whether a value matches the {@link Employee} contract.
 *
 * @param value API payload.
 * @returns `true` when every required field has the expected type.
 */
export const isEmployee = (value: unknown): value is Employee =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.nome) &&
  isString(value.cpf) &&
  isString(value.email) &&
  isString(value.phone) &&
  isOptionalString(value.linkedin) &&
  isAddress(value.endereco) &&
  (value.company === undefined || isCompanyReference(value.company)) &&
  isString(value.createdAt) &&
  isString(value.updatedAt);

/**
 * Checks whether a value is a list made only of employees.
 *
 * @param value API payload.
 * @returns `true` for an array, possibly empty, in which every item is an {@link Employee}.
 */
export const isEmployeeList = (value: unknown): value is Employee[] => Array.isArray(value) && value.every(isEmployee);

/**
 * Copies only the contract fields of an employee, so that unknown backend fields are not passed on.
 * The company is reduced to its identifier.
 *
 * @param employee Validated employee.
 * @returns A new object with the fields of {@link Employee}.
 */
export const toEmployee = (employee: Employee): Employee => {
  const { id, nome, cpf, email, phone, linkedin, endereco, company, createdAt, updatedAt } = employee;

  return {
    id,
    nome,
    cpf,
    email,
    phone,
    linkedin,
    endereco: toAddress(endereco),
    company: company && { id: company.id },
    createdAt,
    updatedAt,
  };
};
