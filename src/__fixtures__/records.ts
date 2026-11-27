import type { Address } from '@/types/address';
import type { Company, CreateCompanyInput } from '@/types/company';
import type { CreateEmployeeInput, Employee } from '@/types/employee';

// Fake data only: zeroed documents and `@exemplo.com` addresses.
export const COMPANY_ID = '11111111-1111-4111-8111-111111111111';
export const EMPLOYEE_ID = '22222222-2222-4222-8222-222222222222';
const TIMESTAMP = '2026-01-01T00:00:00.000Z';

export const buildAddress = (overrides: Partial<Address> = {}): Address => ({
  rua: 'Rua Exemplo',
  numero: '100',
  complemento: 'Sala 1',
  bairro: 'Centro',
  cidade: 'Recife',
  estado: 'PE',
  cep: '00000-000',
  ...overrides,
});

export const buildCompanyInput = (overrides: Partial<CreateCompanyInput> = {}): CreateCompanyInput => ({
  nome: 'Empresa Exemplo',
  cnpj: '00.000.000/0000-00',
  email: 'empresa@exemplo.com',
  phone: '(00) 00000-0000',
  site: 'www.exemplo.com',
  endereco: buildAddress(),
  ...overrides,
});

export const buildCompany = (overrides: Partial<Company> = {}): Company => ({
  ...buildCompanyInput(),
  id: COMPANY_ID,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP,
  ...overrides,
});

export const buildEmployeeInput = (overrides: Partial<CreateEmployeeInput> = {}): CreateEmployeeInput => ({
  nome: 'Pessoa Exemplo',
  cpf: '000.000.000-00',
  email: 'pessoa@exemplo.com',
  phone: '(00) 00000-0000',
  linkedin: 'linkedin.com/in/exemplo',
  endereco: buildAddress(),
  companyId: COMPANY_ID,
  ...overrides,
});

export const buildEmployee = (overrides: Partial<Employee> = {}): Employee => ({
  id: EMPLOYEE_ID,
  nome: 'Pessoa Exemplo',
  cpf: '000.000.000-00',
  email: 'pessoa@exemplo.com',
  phone: '(00) 00000-0000',
  linkedin: 'linkedin.com/in/exemplo',
  endereco: buildAddress(),
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP,
  ...overrides,
});
