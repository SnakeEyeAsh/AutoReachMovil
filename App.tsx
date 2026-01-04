import {
  Text,
  View,
  StatusBar,
  ScrollView,
  Pressable,
  Modal,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import { Cliente } from "./components/Cliente";
import { Picker } from "@react-native-picker/picker";
import { Gestion } from "./components/Gestion";
import { appStyles } from "./Styles/styles";
import { obtenerCoche, obtenerGestiones, obtenerMatriculas, borrarGestionDAO, modificarGestionDAO, agregarGestion } from "./database/ClienteDAO";
import { Coche } from "./components/Coche";
import { coche, gestion } from "./model/Tipos";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
  const [matriculaSeleccionada, setMatriculaSeleccionada] = useState("");
  const [coche, setCoche] = useState<coche>();

  const [gestiones, setGestiones] = useState(false);
  const [coches, setCoches] = useState(false);

  const [nuevaGestion,setNuevaGestion]= useState(false)

  const [matriculas, setMatriculas] = useState<string[]>([]);
  const [gestionesLista, setGestionesLista] = useState<gestion[]>([]);

  // Estados para nueva gestión
  const [nuevoTipo, setNuevoTipo] = useState("cita");
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");
  const [nuevaMatricula, setNuevaMatricula] = useState("");

  // Estados para DatePicker
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  function llenarMatriculas() {
    obtenerMatriculas()
      .then((mats) => {
        console.log("Matriculas obtenidas:", mats);
        setMatriculas(mats);
        setMatriculaSeleccionada(mats[0]);
      })
      .catch((error) => {
        console.error("Error al obtener las matriculas:", error);
      });
  }

  useEffect(() => llenarMatriculas(), []);
  useEffect(() => {setMatriculaSeleccionada(matriculas[0]);}, [matriculas]);

  //console.log("Matriculas en estado:", matriculaSeleccionada);

  function generarCoche() {
    obtenerCoche(matriculaSeleccionada)
      .then((coche) => {
        console.log("Coche obtenido:" + coche);
        setCoche(coche);
      })
      .catch((error) => {
        console.error("Error al obtener el coche:", error);
      });
  }

  function generarGestiones() {
    
    obtenerGestiones()
      .then((gestiones) => {
        console.log("Gestiones obtenidas:" + gestiones);
        setGestionesLista(gestiones);
      })
      .catch((error) => {
        console.error("Error al obtener las gestiones:", error);
      });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////

  function borrarGestionHandler(id: number){
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas borrar esta gestión? Esta operación no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Borrar",
          style: "destructive",
          onPress: () => {
            borrarGestionDAO(id).then(()=>{
              console.log("Gestion borrada correctamente");
              generarGestiones();
            }).catch((error: any)=>{
              console.error("Error al borrar la gestion:", error);
            });
          }
        }
      ]
    );
  }

  function modificarGestionHandler(g:gestion){
    modificarGestionDAO(g).then(()=>{
      console.log("Gestion modificada correctamente");
      generarGestiones(); 
    }).catch((error: any)=>{
      console.error("Error al modificar la gestion:", error);
    });
  }

  function agregarNuevaGestionHandler(g:gestion){
    agregarGestion(g).then(()=>{
      console.log("Gestion agregada correctamente");
      generarGestiones();
    }).catch((error: any)=>{
      console.error("Error al agregar la gestion:", error);
    });
  }

  return (
    <View style={appStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <View style={appStyles.header}>
        <Text style={appStyles.headerTitle}>AutoReach</Text>
        <Text style={appStyles.headerSubtitle}>Gestión de tu vehículo</Text>
      </View>

      <ScrollView style={appStyles.content}>
        <View style={appStyles.profileCard}>
          <Text style={appStyles.cardTitle}>Perfil del Conductor</Text>
          <Cliente nombre={"Pepe"} apellidos={"Gonzales"} />
        </View>

        <View style={appStyles.card}>
          <Text style={appStyles.cardTitle}>Seleccionar Vehículo</Text>

          <Text style={appStyles.label}>Matrícula</Text>
          <View style={appStyles.pickerContainer}>
            <Picker
              selectedValue={matriculaSeleccionada}
              onValueChange={(itemValue) => setMatriculaSeleccionada(itemValue)}
              style={appStyles.picker}
            >
              {matriculas.map((mat) => (
                <Picker.Item key={mat} label={mat} value={mat} />
              ))}
            </Picker>
          </View>
          <Pressable
            style={appStyles.primaryButton}
            onPress={() => {
              generarCoche();
              setCoches(true);
            }}
          >
            <Text style={appStyles.primaryButtonText}>Ver Coche</Text>
          </Pressable>
        </View>

        <View style={appStyles.card}>
          <Text style={appStyles.cardTitle}>Gestiones</Text>

          <Pressable
            style={appStyles.primaryButton}
            onPress={() => {
              generarGestiones();
              setGestiones(true);
            }}
          >
            <Text style={appStyles.primaryButtonText}>
              Ver Gestiones Realizadas
            </Text>
          </Pressable>

          <Pressable
            style={appStyles.secondaryButton}
            onPress={() => {
              setNuevaGestion(true);
            }}
          >
            <Text style={appStyles.secondaryButtonText}>
              Agendar Nueva Cita
            </Text>
          </Pressable>
        </View>
        {gestiones && (
          <Modal transparent={true} animationType="fade">
            <View style={appStyles.modalOverlay}>
              <View style={appStyles.modalContent}>
                <View style={appStyles.modalHeader}>
                  <Text style={appStyles.modalTitle}>Gestiones</Text>
                  <Pressable
                    style={appStyles.closeButton}
                    onPress={() => setGestiones(false)}
                  >
                    <Text style={appStyles.closeButtonText}>✕</Text>
                  </Pressable>
                </View>

                <FlatList
                  data={gestionesLista}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item, index }) => (
                    <Gestion
                      id={item.id}
                      tipo={item.tipo}
                      fecha={item.fecha}
                      hora={item.hora}
                      matriculaRelacionada={item.matriculaRelacionada}
                      index={index}
                      modifiacado={() => modificarGestionHandler(item)}
                      borrado={() => borrarGestionHandler(item.id)}
                      />
                  )}
                  contentContainerStyle={{ paddingVertical: 10 }}
                  showsVerticalScrollIndicator={false}
                />

                <Pressable
                  style={appStyles.backButton}
                  onPress={() => setGestiones(false)}
                >
                  <Text style={appStyles.backButtonText}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
        {coches && (
          <Modal transparent={true} animationType="fade">
            <View style={appStyles.modalOverlay}>
              <View style={appStyles.modalContent}>
                <View style={appStyles.modalHeader}>
                  <Text style={appStyles.modalTitle}>Coches</Text>
                  <Pressable
                    style={appStyles.closeButton}
                    onPress={() => setCoches(false)}
                  >
                    <Text style={appStyles.closeButtonText}>✕</Text>
                  </Pressable>
                </View>

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {coche && (
                    <Coche
                      marca={coche.marca}
                      modelo={coche.modelo}
                      matricula={coche.matricula}
                      kilometros={coche.kilometros}
                    />
                  )}
                </View>

                <Pressable
                  style={appStyles.backButton}
                  onPress={() => setCoches(false)}
                >
                  <Text style={appStyles.backButtonText}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
        {
          nuevaGestion && (
            <Modal transparent={true} animationType="fade">
              <View style={appStyles.modalOverlay}>
                <View style={appStyles.modalContent}>
                  <View style={appStyles.modalHeader}>
                    <Text style={appStyles.modalTitle}>Nueva Gestión</Text>
                    <Pressable
                      style={appStyles.closeButton}
                      onPress={() => setNuevaGestion(false)}
                    >
                      <Text style={appStyles.closeButtonText}>✕</Text>
                    </Pressable>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={appStyles.label}>Tipo de Gestión</Text>
                    <View style={appStyles.pickerContainer}>
                      <Picker
                        selectedValue={nuevoTipo}
                        onValueChange={(itemValue) => setNuevoTipo(itemValue)}
                        style={appStyles.picker}
                      >
                        <Picker.Item label="Cita" value="cita" />
                        <Picker.Item label="Taller" value="taller" />
                      </Picker>
                    </View>

                    <Text style={appStyles.label}>Fecha</Text>
                    <Pressable
                      style={appStyles.inputField}
                      onPress={() => setMostrarDatePicker(true)}
                    >
                      <Text style={{ color: nuevaFecha ? '#1a1a2e' : '#999' }}>
                        {nuevaFecha || 'Selecciona una fecha'}
                      </Text>
                    </Pressable>

                    {mostrarDatePicker && (
                      <DateTimePicker
                        value={fechaSeleccionada}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setMostrarDatePicker(false);
                          if (selectedDate) {
                            setFechaSeleccionada(selectedDate);
                            // Formatear fecha a YYYY-MM-DD
                            const year = selectedDate.getFullYear();
                            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                            const day = String(selectedDate.getDate()).padStart(2, '0');
                            setNuevaFecha(`${year}-${month}-${day}`);
                          }
                        }}
                      />
                    )}

                    <Text style={appStyles.label}>Hora (HH:MM)</Text>
                    <TextInput
                      style={appStyles.inputField}
                      value={nuevaHora}
                      onChangeText={setNuevaHora}
                      placeholder="14:30"
                    />

                    <Text style={appStyles.label}>Matrícula Relacionada</Text>
                    <View style={appStyles.pickerContainer}>
                      <Picker
                        selectedValue={matriculaSeleccionada}
                        onValueChange={(itemValue) => setMatriculaSeleccionada(itemValue)}
                        style={appStyles.picker}
                      >
                        {matriculas.map((mat) => (
                          <Picker.Item key={mat} label={mat} value={mat} />
                        ))}
                      </Picker>
                    </View>
                  </ScrollView>

                  <Pressable
                    style={appStyles.primaryButton}
                    onPress={() => {
                      const nuevaGestionObj: gestion = {
                        id: 0, // El servidor lo asignará
                        tipo: nuevoTipo,
                        fecha: nuevaFecha,
                        hora: nuevaHora,
                        matriculaRelacionada: matriculaSeleccionada
                      };
                      agregarNuevaGestionHandler(nuevaGestionObj);
                      setNuevaGestion(false);
                      // Limpiar campos
                      setNuevoTipo("cita");
                      setNuevaFecha("");
                      setNuevaHora("");
                      setNuevaMatricula("");
                    }}
                  >
                    <Text style={appStyles.primaryButtonText}>Guardar Gestión</Text>
                  </Pressable>

                  <Pressable
                    style={appStyles.backButton}
                    onPress={() => setNuevaGestion(false)}
                  >
                    <Text style={appStyles.backButtonText}>Cancelar</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          )
        }
      </ScrollView>
    </View>
  );
}
