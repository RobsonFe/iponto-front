import { buildCompany } from '@/__fixtures__/records';
import { isCompany, isCompanyList } from '@/types/company';

const REQUIRED_FIELDS = ['id', 'nome', 'cnpj', 'email', 'phone', 'endereco', 'createdAt', 'updatedAt'];

describe('isCompany', () => {
  it('aceita uma empresa completa', () => {
    expect(isCompany(buildCompany())).toBe(true);
  });

  it.each([undefined, null])('aceita o site como %p', (site) => {
    expect(isCompany({ ...buildCompany(), site })).toBe(true);
  });

  it.each(REQUIRED_FIELDS)('rejeita uma empresa sem %s', (field) => {
    expect(isCompany({ ...buildCompany(), [field]: undefined })).toBe(false);
  });

  it.each([...REQUIRED_FIELDS, 'site'])('rejeita %s com tipo errado', (field) => {
    expect(isCompany({ ...buildCompany(), [field]: 10 })).toBe(false);
  });

  it.each([null, undefined, 'empresa', []])('rejeita %p', (value) => {
    expect(isCompany(value)).toBe(false);
  });
});

describe('isCompanyList', () => {
  it('aceita uma lista vazia', () => {
    expect(isCompanyList([])).toBe(true);
  });

  it('aceita uma lista de empresas válidas', () => {
    expect(isCompanyList([buildCompany(), buildCompany()])).toBe(true);
  });

  it('rejeita a lista com um item inválido', () => {
    expect(isCompanyList([buildCompany(), { id: '1' }])).toBe(false);
  });

  it.each([null, {}, { results: [] }])('rejeita %p, que não é uma lista', (value) => {
    expect(isCompanyList(value)).toBe(false);
  });
});
