import { isCount, isOptionalString, isRecord, isString } from '@/utils/guards';

describe('isRecord', () => {
  it('aceita um objeto simples', () => {
    expect(isRecord({ nome: 'Empresa Exemplo' })).toBe(true);
  });

  it.each([null, undefined, [], 'texto', 1, true])('rejeita %p', (value) => {
    expect(isRecord(value)).toBe(false);
  });
});

describe('isString', () => {
  it.each(['', 'texto'])('aceita a string %p', (value) => {
    expect(isString(value)).toBe(true);
  });

  it.each([null, undefined, 1, {}, []])('rejeita %p', (value) => {
    expect(isString(value)).toBe(false);
  });
});

describe('isOptionalString', () => {
  it.each([undefined, null, '', 'texto'])('aceita %p', (value) => {
    expect(isOptionalString(value)).toBe(true);
  });

  it.each([0, false, {}, []])('rejeita %p', (value) => {
    expect(isOptionalString(value)).toBe(false);
  });
});

describe('isCount', () => {
  it.each([0, 1, 250])('aceita a contagem %p', (value) => {
    expect(isCount(value)).toBe(true);
  });

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 2 ** 53, '1', null, undefined])('rejeita %p', (value) => {
    expect(isCount(value)).toBe(false);
  });
});
