import { supabase } from '../../database/supabase'
import { apiGet, apiPost, apiPut, apiDelete, apiGetImage } from '../../database/api'

const mockFetch = global.fetch as jest.Mock
const mockGetSession = supabase.auth.getSession as jest.Mock

const FAKE_TOKEN = 'fake-jwt-token'
const BASE_URL = 'http://10.0.2.2:3000/api'

beforeEach(() => {
  jest.clearAllMocks()
  mockGetSession.mockResolvedValue({
    data: { session: { access_token: FAKE_TOKEN } },
  })
})

describe('apiGet', () => {
  it('hace GET con cabecera Authorization', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 1 }),
    })

    const result = await apiGet('/clientes/1')

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/clientes/1`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${FAKE_TOKEN}`,
        }),
      })
    )
    expect(result).toEqual({ id: 1 })
  })

  it('lanza error si la respuesta no es ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'No encontrado' }),
    })

    await expect(apiGet('/ruta-inexistente')).rejects.toThrow('No encontrado')
  })

  it('lanza error si no hay sesión activa', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } })

    await expect(apiGet('/cualquier-ruta')).rejects.toThrow('No autenticado')
  })
})

describe('apiPost', () => {
  it('hace POST con Content-Type y body JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: 5 }),
    })

    await apiPost('/documentos', { tipo_documento: 'CONTRATO_VENTA' })

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/documentos`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${FAKE_TOKEN}`,
        }),
        body: JSON.stringify({ tipo_documento: 'CONTRATO_VENTA' }),
      })
    )
  })
})

describe('apiPut', () => {
  it('hace PUT con método correcto', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    })

    await apiPut('/documentos/1/firmar', { firmado_por: 'Juan García' })

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/documentos/1/firmar`,
      expect.objectContaining({ method: 'PUT' })
    )
  })
})

describe('apiDelete', () => {
  it('hace DELETE y maneja respuesta 204', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    })

    const result = await apiDelete('/gestiones/3')

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/gestiones/3`,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toBeUndefined()
  })
})

describe('apiGetImage', () => {
  it('devuelve null si la respuesta no es ok', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 })

    const result = await apiGetImage('/clientes/99/imagen')
    expect(result).toBeNull()
  })

  it('devuelve null si fetch lanza excepción', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const result = await apiGetImage('/clientes/1/imagen')
    expect(result).toBeNull()
  })

  it('convierte respuesta binaria a data URI', async () => {
    const fakeBytes = new Uint8Array([72, 101, 108, 108, 111]) // "Hello"
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'image/jpeg' },
      arrayBuffer: async () => fakeBytes.buffer,
    })

    const result = await apiGetImage('/clientes/1/imagen')
    expect(result).toMatch(/^data:image\/jpeg;base64,/)
  })
})
