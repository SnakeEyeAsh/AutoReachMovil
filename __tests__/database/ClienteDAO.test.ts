jest.mock('../../database/api', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiPut: jest.fn(),
  apiDelete: jest.fn(),
  apiGetImage: jest.fn(),
  apiUploadImage: jest.fn(),
  getAuthCliente: jest.fn(),
}))

import {
  obtenerCliente,
  obtenerMatriculas,
  obtenerDocumentos,
  firmarDocumentoDAO,
  actualizarPagoTransaccion,
} from '../../database/ClienteDAO'
import { apiGet, apiPut, getAuthCliente } from '../../database/api'

const mockApiGet = apiGet as jest.Mock
const mockApiPut = apiPut as jest.Mock
const mockGetAuthCliente = getAuthCliente as jest.Mock

const CLIENTE_MOCK = {
  id: 5,
  nombre: 'Juan',
  apellidos: 'García',
  email: 'juan@test.com',
}

beforeEach(() => {
  jest.clearAllMocks()
  mockGetAuthCliente.mockResolvedValue(CLIENTE_MOCK)
})

describe('obtenerCliente', () => {
  it('devuelve id, nombre y apellidos del cliente autenticado', async () => {
    const result = await obtenerCliente()

    expect(mockGetAuthCliente).toHaveBeenCalled()
    expect(result).toEqual({ id: 5, nombre: 'Juan', apellidos: 'García' })
  })

  it('lanza error si no hay usuario autenticado', async () => {
    mockGetAuthCliente.mockResolvedValueOnce(null)

    await expect(obtenerCliente()).rejects.toThrow('No hay usuario autenticado')
  })
})

describe('obtenerMatriculas', () => {
  it('devuelve el array de matrículas', async () => {
    mockApiGet.mockResolvedValueOnce(['1234ABC', '5678DEF'])

    const result = await obtenerMatriculas()

    expect(mockApiGet).toHaveBeenCalledWith('/me/matriculas')
    expect(result).toEqual(['1234ABC', '5678DEF'])
  })

  it('devuelve array vacío si no hay vehículos', async () => {
    mockApiGet.mockResolvedValueOnce([])

    const result = await obtenerMatriculas()
    expect(result).toEqual([])
  })
})

describe('obtenerDocumentos', () => {
  it('llama a la API con el cliente_id del usuario autenticado', async () => {
    mockApiGet.mockResolvedValueOnce([{ id: 1, tipo_documento: 'CONTRATO_VENTA' }])

    const result = await obtenerDocumentos()

    expect(mockApiGet).toHaveBeenCalledWith('/documentos?cliente_id=5')
    expect(result).toHaveLength(1)
  })
})

describe('firmarDocumentoDAO', () => {
  it('llama a PUT /documentos/:id/firmar con firmado_por', async () => {
    mockApiPut.mockResolvedValueOnce(undefined)

    await firmarDocumentoDAO(10, 'Juan García')

    expect(mockApiPut).toHaveBeenCalledWith('/documentos/10/firmar', {
      firmado_por: 'Juan García',
    })
  })
})

describe('actualizarPagoTransaccion', () => {
  it('llama a PUT /transacciones/:id/pago con estado Pagado', async () => {
    mockApiPut.mockResolvedValueOnce(undefined)

    await actualizarPagoTransaccion(3)

    expect(mockApiPut).toHaveBeenCalledWith('/transacciones/3/pago', {
      estado_pago: 'Pagado',
    })
  })
})
