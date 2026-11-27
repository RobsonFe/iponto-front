import { jsonResponse } from '@/__fixtures__/http';
import { buildAddress, buildCompany, buildCompanyInput, COMPANY_ID } from '@/__fixtures__/records';
import {
  countCompanies,
  createCompany,
  deleteCompany,
  findCompany,
  listCompanies,
  updateCompany,
} from '@/services/company-service';

const API_URL = 'http://api.exemplo.test/api/v1';

const mockFetch = (response: Response): jest.SpiedFunction<typeof fetch> =>
  jest.spyOn(global, 'fetch').mockResolvedValue(response);

const sentRequest = (fetchSpy: jest.SpiedFunction<typeof fetch>) => {
  const [url, init] = fetchSpy.mock.calls[0];

  return { url, method: init?.method ?? 'GET', body: init?.body };
};

describe('company-service', () => {
  const originalUrl = process.env.API_URL;

  beforeEach(() => {
    process.env.API_URL = API_URL;
  });

  afterAll(() => {
    process.env.API_URL = originalUrl;
  });

  describe('listCompanies', () => {
    it('lista todas as empresas', async () => {
      const fetchSpy = mockFetch(jsonResponse([buildCompany()]));

      await expect(listCompanies()).resolves.toEqual([buildCompany()]);

      expect(sentRequest(fetchSpy)).toEqual({ url: `${API_URL}/company/list`, method: 'GET', body: undefined });
    });

    it('lista uma página', async () => {
      const fetchSpy = mockFetch(jsonResponse([]));

      await expect(listCompanies({ page: 2, limit: 5 })).resolves.toEqual([]);

      expect(sentRequest(fetchSpy).url).toBe(`${API_URL}/company/list?page=2&limit=5`);
    });

    it('propaga o erro da API', async () => {
      mockFetch(jsonResponse({}, 500));

      await expect(listCompanies()).rejects.toMatchObject({ name: 'ApiError', status: 500 });
    });

    it('recusa uma lista fora do contrato', async () => {
      mockFetch(jsonResponse({ results: [] }));

      await expect(listCompanies()).rejects.toMatchObject({ status: 502, message: 'Unexpected company list payload' });
    });
  });

  describe('findCompany', () => {
    it('busca uma empresa pelo identificador', async () => {
      const fetchSpy = mockFetch(jsonResponse(buildCompany()));

      await expect(findCompany(COMPANY_ID)).resolves.toEqual(buildCompany());

      expect(sentRequest(fetchSpy).url).toBe(`${API_URL}/company/find/${COMPANY_ID}`);
    });

    it('devolve null quando a empresa não existe', async () => {
      mockFetch(jsonResponse({}, 404));

      await expect(findCompany(COMPANY_ID)).resolves.toBeNull();
    });

    it('devolve null para um identificador inválido, sem chamar a API', async () => {
      const fetchSpy = mockFetch(jsonResponse(buildCompany()));

      await expect(findCompany('../count')).resolves.toBeNull();

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('propaga um erro diferente de não encontrado', async () => {
      mockFetch(jsonResponse({}, 500));

      await expect(findCompany(COMPANY_ID)).rejects.toMatchObject({ status: 500 });
    });

    it('recusa uma empresa fora do contrato', async () => {
      mockFetch(jsonResponse({ id: COMPANY_ID }));

      await expect(findCompany(COMPANY_ID)).rejects.toMatchObject({ status: 502 });
    });
  });

  describe('createCompany', () => {
    it('envia os dados e devolve a empresa criada', async () => {
      const fetchSpy = mockFetch(jsonResponse(buildCompany(), 201));

      await expect(createCompany(buildCompanyInput())).resolves.toEqual(buildCompany());

      const { url, method, body } = sentRequest(fetchSpy);
      expect({ url, method }).toEqual({ url: `${API_URL}/company/save`, method: 'POST' });
      expect(JSON.parse(String(body))).toEqual(buildCompanyInput());
    });

    it.each([400, 409])('propaga o status %i', async (status) => {
      mockFetch(jsonResponse({}, status));

      await expect(createCompany(buildCompanyInput())).rejects.toMatchObject({ status });
    });

    it('recusa uma resposta fora do contrato', async () => {
      mockFetch(jsonResponse({}, 201));

      await expect(createCompany(buildCompanyInput())).rejects.toMatchObject({ status: 502 });
    });
  });

  describe('updateCompany', () => {
    it('envia somente os campos alterados', async () => {
      const fetchSpy = mockFetch(jsonResponse(buildCompany({ nome: 'Novo Nome' })));

      await expect(updateCompany(COMPANY_ID, { nome: 'Novo Nome' })).resolves.toEqual(
        buildCompany({ nome: 'Novo Nome' }),
      );

      expect(sentRequest(fetchSpy)).toEqual({
        url: `${API_URL}/company/update/${COMPANY_ID}`,
        method: 'PATCH',
        body: '{"nome":"Novo Nome"}',
      });
    });

    it.each([400, 404, 409])('propaga o status %i', async (status) => {
      mockFetch(jsonResponse({}, status));

      await expect(updateCompany(COMPANY_ID, {})).rejects.toMatchObject({ status });
    });

    it('recusa um identificador inválido, sem chamar a API', async () => {
      const fetchSpy = mockFetch(jsonResponse(buildCompany()));

      await expect(updateCompany('1', {})).rejects.toMatchObject({ status: 404 });

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('recusa uma resposta fora do contrato', async () => {
      mockFetch(jsonResponse(null));

      await expect(updateCompany(COMPANY_ID, {})).rejects.toMatchObject({ status: 502 });
    });
  });

  describe('campos fora do contrato', () => {
    const payload = () => ({
      ...buildCompany(),
      endereco: { ...buildAddress(), interno: 'x' },
      senha: 'segredo',
    });

    it.each([
      ['listCompanies', () => listCompanies().then(([first]) => first), () => jsonResponse([payload()])],
      ['findCompany', () => findCompany(COMPANY_ID), () => jsonResponse(payload())],
      ['createCompany', () => createCompany(buildCompanyInput()), () => jsonResponse(payload(), 201)],
      ['updateCompany', () => updateCompany(COMPANY_ID, {}), () => jsonResponse(payload())],
    ])('são descartados em %s', async (_operation, call, respond) => {
      mockFetch(respond());

      await expect(call()).resolves.toEqual(buildCompany());
    });
  });

  describe('deleteCompany', () => {
    it('exclui a empresa', async () => {
      const fetchSpy = mockFetch(new Response(null, { status: 204 }));

      await expect(deleteCompany(COMPANY_ID)).resolves.toBeUndefined();

      expect(sentRequest(fetchSpy)).toEqual({
        url: `${API_URL}/company/delete/${COMPANY_ID}`,
        method: 'DELETE',
        body: undefined,
      });
    });

    it('propaga o erro quando a empresa não existe', async () => {
      mockFetch(jsonResponse({}, 404));

      await expect(deleteCompany(COMPANY_ID)).rejects.toMatchObject({ status: 404 });
    });

    it('recusa um identificador inválido, sem chamar a API', async () => {
      const fetchSpy = mockFetch(new Response(null, { status: 204 }));

      await expect(deleteCompany('..')).rejects.toMatchObject({ status: 404 });

      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('countCompanies', () => {
    it('devolve a quantidade de empresas', async () => {
      const fetchSpy = mockFetch(new Response('3'));

      await expect(countCompanies()).resolves.toBe(3);

      expect(sentRequest(fetchSpy).url).toBe(`${API_URL}/company/count`);
    });

    it('recusa uma resposta que não é uma contagem', async () => {
      mockFetch(jsonResponse({ total: 3 }));

      await expect(countCompanies()).rejects.toMatchObject({
        status: 502,
        message: 'Unexpected company count payload',
      });
    });

    it('propaga o erro da API', async () => {
      mockFetch(jsonResponse({}, 500));

      await expect(countCompanies()).rejects.toMatchObject({ status: 500 });
    });
  });
});
