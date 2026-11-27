import { redirect } from 'next/navigation';
import { inspect } from 'node:util';
import { jsonResponse } from '@/__fixtures__/http';
import { ApiError, apiRequest } from '@/services/api/server-client';

const API_URL = 'http://api.exemplo.test/api/v1';

const mockFetch = (): jest.SpiedFunction<typeof fetch> => jest.spyOn(global, 'fetch');

const sentHeaders = (fetchSpy: jest.SpiedFunction<typeof fetch>): Headers =>
  new Headers(fetchSpy.mock.calls[0][1]?.headers);

describe('apiRequest', () => {
  const originalUrl = process.env.API_URL;

  beforeEach(() => {
    process.env.API_URL = API_URL;
  });

  afterAll(() => {
    process.env.API_URL = originalUrl;
  });

  describe('requisição', () => {
    it('chama a URL da API com o caminho e devolve o corpo', async () => {
      const fetchSpy = mockFetch().mockResolvedValue(jsonResponse({ nome: 'Empresa Exemplo' }));

      await expect(apiRequest('/company/list')).resolves.toEqual({ nome: 'Empresa Exemplo' });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy.mock.calls[0][0]).toBe('http://api.exemplo.test/api/v1/company/list');
    });

    it('ignora a barra final da URL configurada', async () => {
      process.env.API_URL = `${API_URL}//`;
      const fetchSpy = mockFetch().mockResolvedValue(jsonResponse([]));

      await apiRequest('/company/list');

      expect(fetchSpy.mock.calls[0][0]).toBe('http://api.exemplo.test/api/v1/company/list');
    });

    it('pede JSON e não declara o tipo de um corpo inexistente', async () => {
      const fetchSpy = mockFetch().mockResolvedValue(jsonResponse([]));

      await apiRequest('/company/list');

      expect(sentHeaders(fetchSpy).get('Accept')).toBe('application/json');
      expect(sentHeaders(fetchSpy).has('Content-Type')).toBe(false);
    });

    it('envia método, corpo, tipo do conteúdo e preserva os headers recebidos', async () => {
      const fetchSpy = mockFetch().mockResolvedValue(jsonResponse({}, 201));

      await apiRequest('/company/save', { method: 'POST', body: '{"nome":"X"}', headers: { 'X-Trace': 'abc' } });

      expect(fetchSpy.mock.calls[0][1]).toMatchObject({ method: 'POST', body: '{"nome":"X"}' });
      expect(sentHeaders(fetchSpy).get('Content-Type')).toBe('application/json');
      expect(sentHeaders(fetchSpy).get('X-Trace')).toBe('abc');
    });

    it('limita a espera pela API a 10 segundos', async () => {
      const signal = new AbortController().signal;
      const timeoutSpy = jest.spyOn(AbortSignal, 'timeout').mockReturnValue(signal);
      const fetchSpy = mockFetch().mockResolvedValue(jsonResponse([]));

      await apiRequest('/company/list');

      expect(timeoutSpy).toHaveBeenCalledWith(10_000);
      expect(fetchSpy.mock.calls[0][1]?.signal).toBe(signal);
    });

    it('respeita o sinal de cancelamento de quem chama', async () => {
      const { signal } = new AbortController();
      const fetchSpy = mockFetch().mockResolvedValue(jsonResponse([]));

      await apiRequest('/company/list', { signal });

      expect(fetchSpy.mock.calls[0][1]?.signal).toBe(signal);
    });
  });

  describe('resposta', () => {
    it('devolve undefined quando a API responde 204', async () => {
      mockFetch().mockResolvedValue(new Response(null, { status: 204 }));

      await expect(apiRequest('/company/delete/1', { method: 'DELETE' })).resolves.toBeUndefined();
    });

    it('lê um número enviado como texto, como nas rotas de contagem', async () => {
      mockFetch().mockResolvedValue(new Response('7', { headers: { 'Content-Type': 'text/html' } }));

      await expect(apiRequest('/company/count')).resolves.toBe(7);
    });
  });

  describe('falhas', () => {
    it.each([undefined, ''])('recusa a chamada quando API_URL é %p', async (value) => {
      if (value === undefined) {
        delete process.env.API_URL;
      } else {
        process.env.API_URL = value;
      }
      const fetchSpy = mockFetch();

      await expect(apiRequest('/company/list')).rejects.toThrow('API_URL is not configured');

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it.each([400, 404, 409, 500])('lança ApiError com o status %i sem repassar o corpo da API', async (status) => {
      mockFetch().mockResolvedValue(jsonResponse({ message: 'detalhe interno do backend' }, status));

      const error: unknown = await apiRequest('/company/save', { method: 'POST' }).catch((reason) => reason);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({
        name: 'ApiError',
        status,
        message: 'Backend request failed: POST /company/save',
      });
    });

    it('libera o corpo de uma resposta de erro antes de lançar o ApiError', async () => {
      const cancel = jest.fn();
      mockFetch().mockResolvedValue(new Response(new ReadableStream({ cancel }), { status: 500 }));

      await expect(apiRequest('/company/list')).rejects.toMatchObject({ status: 500 });

      expect(cancel).toHaveBeenCalledTimes(1);
    });

    it('mantém o status HTTP quando a liberação do corpo falha, registrando a causa', async () => {
      const cause = new DOMException('The operation timed out.', 'TimeoutError');
      const body = new ReadableStream({ cancel: () => Promise.reject(cause) });
      mockFetch().mockResolvedValue(new Response(body, { status: 409 }));

      const error: unknown = await apiRequest('/company/save').catch((reason) => reason);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status: 409, cause });
    });

    it('lança o status HTTP quando a resposta de erro não tem corpo', async () => {
      mockFetch().mockResolvedValue(new Response(null, { status: 404 }));

      await expect(apiRequest('/company/list')).rejects.toMatchObject({ name: 'ApiError', status: 404 });
    });

    it.each([
      ['falha de rede', new TypeError('fetch failed')],
      ['tempo esgotado', new DOMException('The operation timed out.', 'TimeoutError')],
    ])('transforma %s em ApiError 503, preservando a causa', async (_label, cause) => {
      mockFetch().mockRejectedValue(cause);

      const error: unknown = await apiRequest('/company/list').catch((reason) => reason);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status: 503, cause });
    });

    it('transforma um corpo que não é JSON em ApiError 502', async () => {
      mockFetch().mockResolvedValue(new Response('<html>erro</html>', { status: 200 }));

      const error: unknown = await apiRequest('/company/list').catch((reason) => reason);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status: 502 });
    });

    it('não leva o conteúdo da resposta para o erro quando o JSON é inválido', async () => {
      mockFetch().mockResolvedValue(new Response('pessoa@exemplo.com;000.000.000-00'));

      const error: unknown = await apiRequest('/employee/list').catch((reason) => reason);

      expect(error).toMatchObject({ status: 502 });
      expect(inspect(error, { depth: 5 })).not.toContain('pessoa@');
    });

    it('transforma uma interrupção na leitura do corpo em ApiError 503, preservando a causa', async () => {
      const cause = new DOMException('The operation timed out.', 'TimeoutError');
      const stalledBody = new ReadableStream({ start: (controller) => controller.error(cause) });
      mockFetch().mockResolvedValue(new Response(stalledBody));

      const error: unknown = await apiRequest('/company/list').catch((reason) => reason);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status: 503, cause });
    });

    const captureFrameworkError = (): unknown => {
      try {
        redirect('/');
      } catch (error) {
        return error;
      }
    };

    it('relança os erros de controle do Next.js lançados pela chamada', async () => {
      const frameworkError = captureFrameworkError();
      mockFetch().mockRejectedValue(frameworkError);

      await expect(apiRequest('/company/list')).rejects.toBe(frameworkError);
    });

    it('relança os erros de controle do Next.js lançados na leitura do corpo', async () => {
      const frameworkError = captureFrameworkError();
      const response = jsonResponse([]);
      jest.spyOn(response, 'text').mockRejectedValue(frameworkError);
      mockFetch().mockResolvedValue(response);

      await expect(apiRequest('/company/list')).rejects.toBe(frameworkError);
    });
  });
});
