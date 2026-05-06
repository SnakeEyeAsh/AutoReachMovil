export type coche={
    marca:string
    modelo:string
    matricula:string
    kilometros:number
    año:number
}
export type gestion={
    id:number
    tipo:string
    fecha:string
    hora:string
    matriculaRelacionada:string
    index?:number
    modificado?:(g:gestion)=>void
    borrado?:()=>void
}
export type gestiones=gestion[]

export type documento={
    id:number
    estado:string
    titulo:string
    descripcion:string
}
