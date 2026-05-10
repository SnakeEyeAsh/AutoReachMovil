export function formatTipoDocumento(tipo: string): string {
  return tipo
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function formatEstadoDocumento(estado: string): string {
  const map: Record<string, string> = {
    PENDIENTE_FIRMA: 'Pendiente de firma',
    FIRMADO: 'Firmado',
    CANCELADO: 'Cancelado',
  }
  return map[estado] ?? estado
}

export function formatFecha(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-ES')
}

export function formatImporte(monto: number): string {
  return `${monto.toLocaleString('es-ES')} €`
}
