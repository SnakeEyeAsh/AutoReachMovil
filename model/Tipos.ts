export type coche={
    marca:string
    modelo:string
    matricula:string
    kilometros:number
    año:number
}
export type documento={
    id:number
    tipo_documento:string
    estado_documento:string
    contenido?:string
    url_pdf?:string
    fecha_creacion:string
    fecha_firma:string|null
    firmado_por:string|null
    cliente:{ id:number; nombre:string; apellidos:string; dni_nif:string }
    transaccion:{ id:number; tipo_transaccion:string; monto_total:number; estado_pago:string }
}
