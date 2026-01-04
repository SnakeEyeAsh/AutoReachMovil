export type coche={
    marca:string
    modelo:string
    matricula:string
    kilometros:number
}
export type gestion={
    id:number
    tipo:string
    fecha:string
    hora:string
    matriculaRelacionada:string
    index?:number
    modifiacado?:()=>void
    borrado?:()=>void
}
export type gestiones=gestion[]