import { jsonResponse } from '@/__fixtures__/http';
import { buildAddress, buildEmployee, buildEmployeeInput, COMPANY_ID, EMPLOYEE_ID } from '@/__fixtures__/records';
import {
  countEmployees,
  createEmployee,
  deleteEmployee,
  findEmployee,
  listEmployees,
  updateEmployee,
} from '@/services/employee-service';
import type { UpdateEmployeeInput } from '@/types/employee';

const API_URL = 'http://api.exemplo.test/api/v1';

const mockFetch = (response: Response): jest.SpiedFunction<typeof fetch> =>
  jest.spyOn(global, 'fetch').mockResolvedValue(response);

const sentRequest = (fetchSpy: jest.SpiedFunction<typeof fetch>) => {
  const [url, init] = fetchSpy.mock.calls[0];

  return { url, method: init?.method ?? 'GET', body: init?.body };
};

describe('employee-service', () => {
  const originalUrl = process.env.API_URL;

  beforeEach(() => {
    process.env.API_URL = API_URL;
  });

  afterAll(() => {
    process.env.API_URL = originalUrl;
  });

  describe('listEmployees', () => {
    it('lista todos os funcionários', async () => {
      const fetchSpy = mockFetch(jsonResponse([buildEmployee()]));

      await expect(listEmployees()).resolves.toEqual([buildEmployee()]);

      expect(sentRequest(fetchSpy)).toEqual({ url: `${API_URL}/employee/list`, method: 'GET', body: undefined });
    });

    it('lista uma página', async () => {
      const fetchSpy = mockFetch(jsonResponse([]));

      await expect(listEmployees({ page: 2, limit: 5 })).resolves.toEqual([]);

      expect(sentRequest(fetchSpy).url).toBe(`${API_URL}/employee/list?page=2&limit=5`);
    });

    it('propaga o erro da API', async () => {
      mockFetch(jsonResponse({}, 500));

      await expect(listEmployees()).rejects.toMatchObject({ name: 'ApiError', status: 500 });
    });

    it('recusa uma lista fora do contrato', async () => {
      mockFetch(jsonResponse({ results: [] }));

      await expect(listEmployees()).rejects.toMatchObject({ status: 502, message: 'Unexpected employee list payload' });
    });
  });

  describe('findEmployee', () => {
    it('busca um funcionário pelo identificador', async () => {
      const fetchSpy = mockFetch(jsonResponse(buildEmployee()));

      await expect(findEmployee(EMPLOYEE_ID)).resolves.toEqual(buildEmployee());

      expect(sentRequest(fetchSpy).url).toBe(`${API_URL}/employee/find/${EMPLOYEE_ID}`);
    });

    it('devolve null quando o funcionário não existe', async () => {
      mockFetch(jsonResponse({}, 404));

      await expect(findEmployee(EMPLOYEE_ID)).resolves.toBeNull();
    });

    it('devolve null para um identificador inválido, sem chamar a API', async () => {
      const fetchSpy = mockFetch(jsonResponse(buildEmployee()));

      await expect(findEmployee('../count')).resolves.toBeNull();

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('propaga um erro diferente de não encontrado', async () => {
      mockFetch(jsonResponse({}, 500));

      await expect(findEmployee(EMPLOYEE_ID)).rejects.toMatchObject({ status: 500 });
    });

    it('recusa um funcionário fora do contrato', async () => {
      mockFetch(jsonResponse({ id: EMPLOYEE_ID }));

      await expect(findEmployee(EMPLOYEE_ID)).rejects.toMatchObject({ status: 502 });
    });
  });

  describe('createEmployee', () => {
    it('envia os dados e devolve o funcionário criado', async () => {
      const fetchSpy = mockFetch(jsonResponse(buildEmployee(), 201));

      await expect(createEmployee(buildEmployeeInput())).resolves.toEqual(buildEmployee());

      const { url, method, body } = sentRequest(fetchSpy);
      expect({ url, method }).toEqual({ url: `${API_URL}/employee/save`, method: 'POST' });
      expect(JSON.parse(String(body))).toEqual(buildEmployeeInput());
    });

    it.each([400, 404, 409])('propaga o status %i', async (status) => {
      mockFetch(jsonResponse({}, status));

      await expect(createEmployee(buildEmployeeInput())).rejects.toMatchObject({ status });
    });

    it('recusa uma resposta fora do contrato', async () => {
      mockFetch(jsonResponse({}, 201));

      await expect(createEmployee(buildEmployeeInput())).rejects.toMatchObject({ status: 502 });
    });
  });

  describe('updateEmployee', () => {
    const buildUpdate = (): UpdateEmployeeInput => ({
      nome: 'Novo Nome',
      cpf: '000.000.000-00',
      email: 'pessoa@exemplo.com',
      phone: '(00) 00000-0000',
      companyId: COMPANY_ID,
    });

    it('envia os campos obrigatórios sem o endereço', async () => {
      const fetchSpy = mockFetch(jsonResponse(buildEmployee({ nome: 'Novo Nome', company: { id: COMPANY_ID } })));

      await expect(updateEmployee(EMPLOYEE_ID, buildUpdate())).resolves.toEqual(
        buildEmployee({ nome: 'Novo Nome', company: { id: COMPANY_ID } }),
      );

      const { url, method, body } = sentRequest(fetchSpy);
      expect({ url, method }).toEqual({ url: `${API_URL}/employee/update/${EMPLOYEE_ID}`, method: 'PATCH' });
      expect(JSON.parse(String(body))).toEqual(buildUpdate());
    });

    it.each([400, 404, 409])('propaga o status %i', async (status) => {
      mockFetch(jsonResponse({}, status));

      await expect(updateEmployee(EMPLOYEE_ID, buildUpdate())).rejects.toMatchObject({ status });
    });

    it('recusa um identificador inválido, sem chamar a API', async () => {
      const fetchSpy = mockFetch(jsonResponse(buildEmployee()));

      await expect(updateEmployee('1', buildUpdate())).rejects.toMatchObject({ status: 404 });

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('recusa uma resposta fora do contrato', async () => {
      mockFetch(jsonResponse(null));

      await expect(updateEmployee(EMPLOYEE_ID, buildUpdate())).rejects.toMatchObject({ status: 502 });
    });
  });

  describe('campos fora do contrato', () => {
    const payload = () => ({
      ...buildEmployee(),
      company: { id: COMPANY_ID, cnpj: '00.000.000/0000-00' },
      endereco: { ...buildAddress(), interno: 'x' },
      senha: 'segredo',
    });

    it.each([
      ['listEmployees', () => listEmployees().then(([first]) => first), () => jsonResponse([payload()])],
      ['findEmployee', () => findEmployee(EMPLOYEE_ID), () => jsonResponse(payload())],
      ['createEmployee', () => createEmployee(buildEmployeeInput()), () => jsonResponse(payload(), 201)],
      ['updateEmployee', () => updateEmployee(EMPLOYEE_ID, buildEmployeeInput()), () => jsonResponse(payload())],
    ])('são descartados em %s', async (_operation, call, respond) => {
      mockFetch(respond());

      await expect(call()).resolves.toEqual(buildEmployee({ company: { id: COMPANY_ID } }));
    });
  });

  describe('deleteEmployee', () => {
    it('exclui o funcionário', async () => {
      const fetchSpy = mockFetch(new Response(null, { status: 204 }));

      await expect(deleteEmployee(EMPLOYEE_ID)).resolves.toBeUndefined();

      expect(sentRequest(fetchSpy)).toEqual({
        url: `${API_URL}/employee/delete/${EMPLOYEE_ID}`,
        method: 'DELETE',
        body: undefined,
      });
    });

    it('propaga o erro quando o funcionário não existe', async () => {
      mockFetch(jsonResponse({}, 404));

      await expect(deleteEmployee(EMPLOYEE_ID)).rejects.toMatchObject({ status: 404 });
    });

    it('recusa um identificador inválido, sem chamar a API', async () => {
      const fetchSpy = mockFetch(new Response(null, { status: 204 }));

      await expect(deleteEmployee('..')).rejects.toMatchObject({ status: 404 });

      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('countEmployees', () => {
    it('devolve a quantidade de funcionários', async () => {
      const fetchSpy = mockFetch(new Response('3'));

      await expect(countEmployees()).resolves.toBe(3);

      expect(sentRequest(fetchSpy).url).toBe(`${API_URL}/employee/count`);
    });

    it('recusa uma resposta que não é uma contagem', async () => {
      mockFetch(jsonResponse({ total: 3 }));

      await expect(countEmployees()).rejects.toMatchObject({
        status: 502,
        message: 'Unexpected employee count payload',
      });
    });

    it('propaga o erro da API', async () => {
      mockFetch(jsonResponse({}, 500));

      await expect(countEmployees()).rejects.toMatchObject({ status: 500 });
    });
  });
});
