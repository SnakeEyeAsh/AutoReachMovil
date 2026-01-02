import {
  Text,
  View,
  StatusBar,
  ScrollView,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Cliente } from "./components/Cliente";
import { Picker } from "@react-native-picker/picker";
import { Gestion } from "./components/Gestion";
import { appStyles } from "./Styles/styles";
import { obtenerCoche, obtenerGestiones, obtenerMatriculas } from "./database/ClienteDAO";
import { Coche } from "./components/Coche";
import { coche, gestion } from "./model/Tipos";

export default function App() {
  const [matriculaSeleccionada, setMatriculaSeleccionada] = useState("");
  const [coche, setCoche] = useState<coche>();

  const [gestiones, setGestiones] = useState(false);
  const [coches, setCoches] = useState(false);

  const [matriculas, setMatriculas] = useState<string[]>([]);
  const [gestionesLista, setGestionesLista] = useState<gestion[]>([]);

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

  console.log("Matriculas en estado:", matriculaSeleccionada);

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
            onPress={() => setCoches(true)}
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
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Gestion
                      tipo={item.tipo}
                      fecha={item.fecha}
                      hora={item.hora}
                      matriculaRelacionada={item.matriculaRelacionada}                    
                      />
                  )}
                  
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
      </ScrollView>
    </View>
  );
}
