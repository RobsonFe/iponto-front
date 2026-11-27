import { buildItemPath, buildListPath, isNotFound, parsePayload } from '@/services/api/resource';
import { ApiError } from '@/services/api/server-client';
import { isString } from '@/utils/guards';

const ID = '11111111-1111-4111-8111-111111111111';

const captureError = (run: () => unknown): unknown => {
  try {
    run();
  } catch (error) {
    return error;
  }
};

describe('buildListPath', () => {
  it('lista sem paginação', () => {
    expect(buildListPath('company')).toBe('/company/list');
  });

  it('envia página e limite juntos', () => {
    expect(buildListPath('employee', { page: 2, limit: 10 })).toBe('/employee/list?page=2&limit=10');
  });

  it('mantém o valor zero para a API recusar, sem trocar por outro', () => {
    expect(buildListPath('employee', { page: 0, limit: 0 })).toBe('/employee/list?page=0&limit=0');
  });
});

describe('buildItemPath', () => {
  it.each(['find', 'update', 'delete'] as const)('monta o caminho de %s', (operation) => {
    expect(buildItemPath('company', operation, ID)).toBe(`/company/${operation}/11111111-1111-4111-8111-111111111111`);
  });

  it.each(['', '1', '..', '../count', `${ID}?page=1`])('trata o identificador %p como não encontrado', (id) => {
    const error = captureError(() => buildItemPath('employee', 'delete', id));

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, message: 'Invalid employee id' });
  });
});

describe('parsePayload', () => {
  it('devolve o corpo que respeita o contrato', () => {
    expect(parsePayload('texto', isString, 'name')).toBe('texto');
  });

  it('lança ApiError 502 sem expor o corpo recebido', () => {
    const error = captureError(() => parsePayload({ cpf: '000.000.000-00' }, isString, 'employee'));

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 502, message: 'Unexpected employee payload' });
  });
});

describe('isNotFound', () => {
  it('reconhece um ApiError 404', () => {
    expect(isNotFound(new ApiError(404, 'not found'))).toBe(true);
  });

  it.each([new ApiError(500, 'failure'), new Error('404'), { status: 404 }, null])('não reconhece %p', (error) => {
    expect(isNotFound(error)).toBe(false);
  });
});
