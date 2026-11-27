import { buildEmployee, COMPANY_ID } from '@/__fixtures__/records';
import { isEmployee, isEmployeeList } from '@/types/employee';

const REQUIRED_FIELDS = ['id', 'nome', 'cpf', 'email', 'phone', 'endereco', 'createdAt', 'updatedAt'];

describe('isEmployee', () => {
  it('aceita um funcionário sem a empresa, como em find e list', () => {
    expect(isEmployee(buildEmployee())).toBe(true);
  });

  it('aceita um funcionário com a referência da empresa, como em save e update', () => {
    expect(isEmployee(buildEmployee({ company: { id: COMPANY_ID } }))).toBe(true);
  });

  it.each([undefined, null])('aceita o linkedin como %p', (linkedin) => {
    expect(isEmployee({ ...buildEmployee(), linkedin })).toBe(true);
  });

  it.each(REQUIRED_FIELDS)('rejeita um funcionário sem %s', (field) => {
    expect(isEmployee({ ...buildEmployee(), [field]: undefined })).toBe(false);
  });

  it.each([...REQUIRED_FIELDS, 'linkedin', 'company'])('rejeita %s com tipo errado', (field) => {
    expect(isEmployee({ ...buildEmployee(), [field]: 10 })).toBe(false);
  });

  it.each([null, {}, { id: 10 }])('rejeita a empresa %p', (company) => {
    expect(isEmployee({ ...buildEmployee(), company })).toBe(false);
  });

  it.each([null, undefined, 'funcionário', []])('rejeita %p', (value) => {
    expect(isEmployee(value)).toBe(false);
  });
});

describe('isEmployeeList', () => {
  it('aceita uma lista vazia', () => {
    expect(isEmployeeList([])).toBe(true);
  });

  it('aceita uma lista de funcionários válidos', () => {
    expect(isEmployeeList([buildEmployee(), buildEmployee()])).toBe(true);
  });

  it('rejeita a lista com um item inválido', () => {
    expect(isEmployeeList([buildEmployee(), { id: '1' }])).toBe(false);
  });

  it.each([null, {}, { results: [] }])('rejeita %p, que não é uma lista', (value) => {
    expect(isEmployeeList(value)).toBe(false);
  });
});
