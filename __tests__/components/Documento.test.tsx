import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Documento } from '../../components/Documento'
import { documento } from '../../model/Tipos'

jest.mock('../../database/ClienteDAO', () => ({
  firmarDocumentoDAO: jest.fn(),
  actualizarPagoTransaccion: jest.fn(),
}))

const DOC_PENDIENTE: documento = {
  id: 1,
  tipo_documento: 'CONTRATO_VENTA',
  estado_documento: 'PENDIENTE_FIRMA',
  contenido: 'Contenido del contrato',
  url_pdf: null as any,
  fecha_creacion: '2024-01-15T10:00:00',
  fecha_firma: null,
  firmado_por: null,
  cliente: { id: 5, nombre: 'Juan', apellidos: 'García', dni_nif: '12345678A' },
  transaccion: { id: 3, tipo_transaccion: 'VENTA', monto_total: 15000, estado_pago: 'Pendiente' },
}

const DOC_FIRMADO: documento = {
  ...DOC_PENDIENTE,
  id: 2,
  estado_documento: 'FIRMADO',
  fecha_firma: '2024-02-01T12:00:00',
  firmado_por: 'Juan García',
}

describe('Documento — estado PENDIENTE_FIRMA', () => {
  it('muestra el tipo de documento formateado', () => {
    const { getByText } = render(<Documento doc={DOC_PENDIENTE} onFirmado={() => {}} />)
    expect(getByText('Contrato Venta')).toBeTruthy()
  })

  it('muestra el estado "Pendiente de firma"', () => {
    const { getByText } = render(<Documento doc={DOC_PENDIENTE} onFirmado={() => {}} />)
    expect(getByText('Pendiente de firma')).toBeTruthy()
  })

  it('muestra el importe de la transacción', () => {
    const { getByText } = render(<Documento doc={DOC_PENDIENTE} onFirmado={() => {}} />)
    expect(getByText(/15.000/)).toBeTruthy()
  })

  it('muestra el tipo de transacción', () => {
    const { getByText } = render(<Documento doc={DOC_PENDIENTE} onFirmado={() => {}} />)
    expect(getByText('VENTA')).toBeTruthy()
  })

  it('muestra el botón de firmar', () => {
    const { getByText } = render(<Documento doc={DOC_PENDIENTE} onFirmado={() => {}} />)
    expect(getByText('Firmar documento')).toBeTruthy()
  })

  it('abre el modal de firma al pulsar el botón', () => {
    const { getByText } = render(<Documento doc={DOC_PENDIENTE} onFirmado={() => {}} />)
    fireEvent.press(getByText('Firmar documento'))
    expect(getByText('Firma del Documento')).toBeTruthy()
  })
})

describe('Documento — estado FIRMADO', () => {
  it('muestra el estado "Firmado"', () => {
    const { getByText } = render(<Documento doc={DOC_FIRMADO} onFirmado={() => {}} />)
    expect(getByText('Firmado')).toBeTruthy()
  })

  it('NO muestra el botón de firmar', () => {
    const { queryByText } = render(<Documento doc={DOC_FIRMADO} onFirmado={() => {}} />)
    expect(queryByText('Firmar documento')).toBeNull()
  })

  it('muestra la fecha de firma', () => {
    const { getByText } = render(<Documento doc={DOC_FIRMADO} onFirmado={() => {}} />)
    expect(getByText('Firmado el')).toBeTruthy()
  })
})
