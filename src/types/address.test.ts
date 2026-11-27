import { buildAddress } from '@/__fixtures__/records';
import { isAddress } from '@/types/address';

describe('isAddress', () => {
  it('aceita um endereço completo', () => {
    expect(isAddress(buildAddress())).toBe(true);
  });

  it.each([undefined, null])('aceita número e complemento como %p', (value) => {
    expect(isAddress({ ...buildAddress(), numero: value, complemento: value })).toBe(true);
  });

  it.each(['rua', 'bairro', 'cidade', 'estado', 'cep'])('rejeita um endereço sem %s', (field) => {
    expect(isAddress({ ...buildAddress(), [field]: undefined })).toBe(false);
  });

  it.each(['rua', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'cep'])(
    'rejeita %s que não é texto',
    (field) => {
      expect(isAddress({ ...buildAddress(), [field]: 10 })).toBe(false);
    },
  );

  it.each([null, undefined, 'Rua Exemplo', []])('rejeita %p', (value) => {
    expect(isAddress(value)).toBe(false);
  });
});
