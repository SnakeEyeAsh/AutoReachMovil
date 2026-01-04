import { Platform } from "react-native";
import axios from "axios";
import { coche, gestion, gestiones } from "../model/Tipos";

const IP = Platform.OS === "android" ? "10.0.2.2" : "localhost";

const URL = `http://${IP}:3000`;

export async function obtenerMatriculas(): Promise<string[]> {
  console.log("cargando matriculas");
  const url = `${URL}/coches`;
  const respuesta = await axios.get(url);
  return respuesta.data.map((coche: coche) => coche.matricula);
}

export async function obtenerCoche(matricula: string): Promise<coche> {
  let coche = null;
  const url = `${URL}/coches`;
  const respuesta = await axios.get(url);
  let cocheDev = respuesta.data.find((c: coche) => c.matricula === matricula);
  if (cocheDev != null) {
    coche = cocheDev;
    console.log("Coche encontrado:", coche);
  } else {
    coche = {
      marca: "Desconocida",
      modelo: "Desconocido",
      matricula: matricula,
      kilometros: 0,
    };
  }
  return coche;
}

export async function obtenerGestiones(): Promise<gestiones> {
  const url = `${URL}/gestiones`;
  const respuesta = await axios.get(url);
  return respuesta.data;
}

export async function agregarGestion(gestion:gestion) {
  const url = `${URL}/gestiones`;
  const respuesta = await axios.post(url, gestion);
  console.log("Gestión agregada exitosamente:", respuesta.data);
  return respuesta.data;
}

export async function borrarGestionDAO(id: number) {
  const url = `${URL}/gestiones/${id}`;
  await axios.delete(url);
  console.log(`Gestión con ID ${id} borrada exitosamente`);
}

export async function modificarGestionDAO(gestion: gestion) {
  const url = `${URL}/gestiones/${gestion.id}`;
  await axios.put(url, gestion);
  console.log(`Gestión con ID ${gestion.id} modificada exitosamente`);
}
