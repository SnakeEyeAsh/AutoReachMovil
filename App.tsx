import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  Pressable,
  Modal,
} from "react-native";
import { Cliente } from "./components/Cliente";
import { Picker } from "@react-native-picker/picker";
import { Coche } from "./components/Coche";
import { appStyles } from "./Styles/styles";
import {
  obtenerCoche,
  obtenerMatriculas,
  obtenerCliente,
} from "./database/ClienteDAO";
import { coche } from "./model/Tipos";
import { GestionesScreen } from "./screens/GestionesScreen";
import { NuevaGestionScreen } from "./screens/NuevaGestionScreen";
import { DocumentosScreen } from "./screens/DocumentosScreen";
import { TabBar } from "./components/TabBar";

type Screen = "Home" | "Gestiones" | "NuevaGestion" | "Documentos";

function HomeScreen() {
  const [clienteNombre, setClienteNombre] = useState("...");
  const [clienteApellidos, setClienteApellidos] = useState("...");
  const [matriculaSeleccionada, setMatriculaSeleccionada] = useState("");
  const [matriculas, setMatriculas] = useState<string[]>([]);
  const [coche, setCoche] = useState<coche>();
  const [mostrarCoche, setMostrarCoche] = useState(false);

  useEffect(() => {
    obtenerMatriculas()
      .then((mats) => {
        setMatriculas(mats);
        setMatriculaSeleccionada(mats[0] ?? "");
      })
      .catch(() => {});

    obtenerCliente()
      .then((c) => {
        setClienteNombre(c.nombre);
        setClienteApellidos(c.apellidos);
      })
      .catch(() => {});
  }, []);

  function verCoche() {
    obtenerCoche(matriculaSeleccionada)
      .then((c) => {
        setCoche(c);
        setMostrarCoche(true);
      })
      .catch(() => {});
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <View style={appStyles.header}>
        <Text style={appStyles.headerTitle}>AutoReach</Text>
        <Text style={appStyles.headerSubtitle}>Gestión de tu vehículo</Text>
      </View>

      <ScrollView style={appStyles.content}>
        <View style={appStyles.profileCard}>
          <Text style={appStyles.cardTitle}>Perfil del Conductor</Text>
          <Cliente nombre={clienteNombre} apellidos={clienteApellidos} />
        </View>

        <View style={appStyles.card}>
          <Text style={appStyles.cardTitle}>Seleccionar Vehículo</Text>
          <Text style={appStyles.label}>Matrícula</Text>
          <View style={appStyles.pickerContainer}>
            <Picker
              selectedValue={matriculaSeleccionada}
              onValueChange={setMatriculaSeleccionada}
              style={appStyles.picker}
            >
              {matriculas.map((mat) => (
                <Picker.Item key={mat} label={mat} value={mat} />
              ))}
            </Picker>
          </View>
          <Pressable style={appStyles.primaryButton} onPress={verCoche}>
            <Text style={appStyles.primaryButtonText}>Ver Coche</Text>
          </Pressable>
        </View>
      </ScrollView>

      {mostrarCoche && (
        <Modal transparent={true} animationType="fade">
          <View style={appStyles.modalOverlay}>
            <View style={appStyles.modalContent}>
              <View style={appStyles.modalHeader}>
                <Text style={appStyles.modalTitle}>Vehículo</Text>
                <Pressable
                  style={appStyles.closeButton}
                  onPress={() => setMostrarCoche(false)}
                >
                  <Text style={appStyles.closeButtonText}>✕</Text>
                </Pressable>
              </View>

              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
                onPress={() => setMostrarCoche(false)}
              >
                <Text style={appStyles.backButtonText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("Home");

  function navigate(s: string) {
    setScreen(s as Screen);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={{ flex: 1 }}>
        {screen === "Home"         && <HomeScreen />}
        {screen === "Gestiones"    && <GestionesScreen onNavigate={navigate} />}
        {screen === "NuevaGestion" && <NuevaGestionScreen onNavigate={navigate} />}
        {screen === "Documentos"   && <DocumentosScreen onNavigate={navigate} />}
      </View>
      <TabBar active={screen} onNavigate={(s) => setScreen(s)} />
    </View>
  );
}
