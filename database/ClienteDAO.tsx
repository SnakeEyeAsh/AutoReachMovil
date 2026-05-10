import { supabase } from './supabase'
import { coche, documento } from '../model/Tipos'
import { apiGet, apiPut, apiGetImage, apiUploadImage } from './api'

export async function obtenerCliente(): Promise<{ id: number; nombre: string; apellidos: string }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) throw new Error('No hay usuario autenticado')
  const clientes = await apiGet<any[]>(`/clientes?search=${encodeURIComponent(user.email)}`)
  const cliente = clientes.find((c: any) => c.email === user.email)
  if (!cliente) throw new Error('Cliente no encontrado')
  return { id: cliente.id, nombre: cliente.nombre, apellidos: cliente.apellidos }
}

export async function obtenerMatriculas(): Promise<string[]> {
  return apiGet<string[]>('/me/matriculas')
}

export async function obtenerCoche(matricula: string): Promise<coche> {
  return apiGet<coche>(`/me/coches/${matricula}`)
}

export async function obtenerImagenCliente(clienteId: number): Promise<string | null> {
  return apiGetImage(`/clientes/${clienteId}/imagen`)
}

export async function subirImagenCliente(clienteId: number, imageUri: string): Promise<void> {
  return apiUploadImage(`/clientes/${clienteId}/imagen`, imageUri)
}

export async function obtenerDocumentos(): Promise<documento[]> {
  const { id } = await obtenerCliente()
  return apiGet<documento[]>(`/documentos?cliente_id=${id}`)
}

export async function firmarDocumentoDAO(id: number, firmadoPor: string): Promise<void> {
  return apiPut<void>(`/documentos/${id}/firmar`, { firmado_por: firmadoPor })
}

export async function actualizarPagoTransaccion(transaccionId: number): Promise<void> {
  return apiPut<void>(`/transacciones/${transaccionId}/pago`, { estado_pago: 'Pagado' })
}
