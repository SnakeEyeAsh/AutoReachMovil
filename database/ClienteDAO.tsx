import { Platform } from "react-native";
import axios from "axios";  
import { coche, gestiones } from "../model/Tipos";
import { Gestion } from "../components/Gestion";

const IP = Platform.OS === "android" ? "10.0.2.2" : "localhost";

const URL = `http://${IP}:3000/cliente`;

export async function obtenerMatriculas():Promise<string[]> {
    
    console.log("cargando matriculas")
    const url = `http://${IP}:3000/cliente`;
    const respuesta = await axios.get(url)
    return respuesta.data.coches.map((coche:coche)=> coche.matricula);
    
}

export async function obtenerCoche(matricula:string):Promise<coche>{

    let coche = null;
    const url = `http://${IP}:3000/cliente`;
    const respuesta = await axios.get(url)
    let cocheDev = respuesta.data.coches.find((c:coche)=>c.matricula===matricula);
    if(cocheDev!=null){
        coche = cocheDev;
        console.log("Coche encontrado:"+coche+"hola");
    }else{
        coche = {
            marca: "Desconocida",
            modelo: "Desconocido",
            matricula: matricula,
            kilometros: 0
        }
    }
    return coche;
    
}

export async function obtenerGestiones():Promise<gestiones>{

    let gestiones = null;
    const url = `http://${IP}:3000/cliente`;
    const respuesta = await axios.get(url)
    gestiones = respuesta.data.gestiones;

    return gestiones

}

export async function agregarGestion(gestion:any){

}   
export async function borrarGestion(id:string){

} 

export async function modificarGestion(){

}