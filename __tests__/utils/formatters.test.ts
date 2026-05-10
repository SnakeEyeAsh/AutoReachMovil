import {
  formatTipoDocumento,
  formatEstadoDocumento,
  formatFecha,
  formatImporte,
} from '../../utils/formatters'

describe('formatTipoDocumento', () => {
  it('convierte CONTRATO_VENTA a formato legible', () => {
    expect(formatTipoDocumento('CONTRATO_VENTA')).toBe('Contrato Venta')
  })

  it('convierte CONTRATO_ALQUILER a formato legible', () => {
    expect(formatTipoDocumento('CONTRATO_ALQUILER')).toBe('Contrato Alquiler')
  })

  it('maneja tipos de una sola palabra', () => {
    expect(formatTipoDocumento('FACTURA')).toBe('Factura')
  })

  it('maneja cadena vacía sin lanzar error', () => {
    expect(formatTipoDocumento('')).toBe('')
  })
})

describe('formatEstadoDocumento', () => {
  it('devuelve "Pendiente de firma" para PENDIENTE_FIRMA', () => {
    expect(formatEstadoDocumento('PENDIENTE_FIRMA')).toBe('Pendiente de firma')
  })

  it('devuelve "Firmado" para FIRMADO', () => {
    expect(formatEstadoDocumento('FIRMADO')).toBe('Firmado')
  })

  it('devuelve "Cancelado" para CANCELADO', () => {
    expect(formatEstadoDocumento('CANCELADO')).toBe('Cancelado')
  })

  it('devuelve el valor original para estados desconocidos', () => {
    expect(formatEstadoDocumento('ESTADO_NUEVO')).toBe('ESTADO_NUEVO')
  })
})

describe('formatFecha', () => {
  it('formatea una fecha ISO a formato español', () => {
    const resultado = formatFecha('2024-01-15T10:00:00')
    expect(resultado).toMatch(/15/)
    expect(resultado).toMatch(/2024/)
  })

  it('no lanza error con fechas válidas', () => {
    expect(() => formatFecha('2024-06-01T00:00:00')).not.toThrow()
  })
})

describe('formatImporte', () => {
  it('añade símbolo de euro', () => {
    expect(formatImporte(15000)).toContain('€')
  })

  it('formatea cero correctamente', () => {
    expect(formatImporte(0)).toContain('€')
  })

  it('maneja importes grandes', () => {
    const resultado = formatImporte(100000)
    expect(resultado).toContain('€')
  })
})
