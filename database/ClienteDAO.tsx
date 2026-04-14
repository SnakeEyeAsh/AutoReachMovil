import { supabase } from './supabase'
import { coche, gestion, gestiones, documento } from '../model/Tipos'

async function obtenerClienteId(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) throw new Error('No hay usuario autenticado')

  const { data, error } = await supabase
    .from('clientes')
    .select('id')
    .eq('email', user.email)
    .single()
  if (error) throw error
  return data.id
}

export async function obtenerCliente(): Promise<{ nombre: string; apellidos: string }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) throw new Error('No hay usuario autenticado')

  const { data, error } = await supabase
    .from('clientes')
    .select('nombre, apellidos')
    .eq('email', user.email)
    .single()
  if (error) throw error
  return data
}

export async function obtenerMatriculas(): Promise<string[]> {
  const clienteId = await obtenerClienteId()
  const { data, error } = await supabase
    .from('transacciones')
    .select('coches(matricula)')
    .eq('cliente_id', clienteId)
  if (error) throw error
  const matriculas = data
    .map((t: any) => t.coches?.matricula)
    .filter((m: string | undefined): m is string => !!m)
  return [...new Set(matriculas)]
}

export async function obtenerCoche(matricula: string): Promise<coche> {
  const { data, error } = await supabase
    .from('coches')
    .select('matricula, kilometraje, anio, modelos(nombre, marcas(nombre))')
    .eq('matricula', matricula)
    .single() as any
  if (error || !data) {
    return { marca: 'Desconocida', modelo: 'Desconocido', matricula, kilometros: 0, año: 0 }
  }
  const modelo = data.modelos
  return {
    marca: modelo?.marcas?.nombre ?? 'Desconocida',
    modelo: modelo?.nombre ?? 'Desconocido',
    matricula: data.matricula,
    kilometros: data.kilometraje,
    año: data.anio ?? 0,
  }
}

export async function obtenerGestiones(): Promise<gestiones> {
  const clienteId = await obtenerClienteId()
  const { data, error } = await supabase
    .from('transacciones')
    .select('id, tipo_transaccion, fecha_transaccion, coches(matricula)')
    .eq('cliente_id', clienteId)
  if (error) throw error
  return data.map((t: any) => {
    const dt = new Date(t.fecha_transaccion)
    const fecha = dt.toISOString().split('T')[0]
    const hora = dt.toTimeString().slice(0, 5)
    return {
      id: t.id,
      tipo: t.tipo_transaccion,
      fecha,
      hora,
      matriculaRelacionada: (t.coches as any)?.matricula ?? '',
    }
  })
}

export async function agregarGestion(gestion: gestion) {
  const { data: cocheData, error: cocheError } = await supabase
    .from('coches')
    .select('vin')
    .eq('matricula', gestion.matriculaRelacionada)
    .single()
  if (cocheError) throw cocheError

  const fechaTransaccion = `${gestion.fecha}T${gestion.hora}:00`
  const { data, error } = await supabase
    .from('transacciones')
    .insert({
      tipo_transaccion: gestion.tipo,
      vin_coche: cocheData.vin,
      cliente_id: await obtenerClienteId(),
      fecha_transaccion: fechaTransaccion,
      monto_total: 0,
    })
  if (error) throw error
  return data
}

export async function borrarGestionDAO(id: number) {
  const { error } = await supabase
    .from('transacciones')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function modificarGestionDAO(gestion: gestion) {
  const { data: cocheData, error: cocheError } = await supabase
    .from('coches')
    .select('vin')
    .eq('matricula', gestion.matriculaRelacionada)
    .single()
  if (cocheError) throw cocheError

  const fechaTransaccion = `${gestion.fecha}T${gestion.hora}:00`
  const { error } = await supabase
    .from('transacciones')
    .update({
      tipo_transaccion: gestion.tipo,
      vin_coche: cocheData.vin,
      fecha_transaccion: fechaTransaccion,
    })
    .eq('id', gestion.id)
  if (error) throw error
}

export async function obtenerDocumentos(): Promise<documento[]> {
  // No existe tabla documentos en Supabase aún
  return []
}

export async function firmarDocumentoDAO(_id: number) {
  // No existe tabla documentos en Supabase aún
}
