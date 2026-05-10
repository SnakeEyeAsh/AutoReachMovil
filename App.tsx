import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  Pressable,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import { Cliente } from "./components/Cliente";
import { Picker } from "@react-native-picker/picker";
import { Coche } from "./components/Coche";
import { appStyles, colors } from "./Styles/styles";
import {
  obtenerCoche,
  obtenerMatriculas,
  obtenerCliente,
} from "./database/ClienteDAO";
import { coche } from "./model/Tipos";
import { TalleresScreen } from "./screens/TalleresScreen";
import { DocumentosScreen } from "./screens/DocumentosScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { SplashScreen } from "./screens/SplashScreen";
import { TabBar } from "./components/TabBar";
import { supabase } from "./database/supabase";

type Tab = "Home" | "Talleres" | "Documentos";
type Screen = "Splash" | "Login" | Tab;

function HomeScreen({ onLogout }: { onLogout: () => void }) {
  const [clienteNombre, setClienteNombre] = useState("...");
  const [clienteApellidos, setClienteApellidos] = useState("...");
  const [clienteId, setClienteId] = useState(0);
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
        setClienteId(c.id);
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

  const FEATURES = [
    { icon: "🚗", title: "Tu Flota", desc: "Control total sobre cada vehículo" },
    { icon: "📄", title: "Contratos Digitales", desc: "Firma al instante desde la app" },
    { icon: "🔧", title: "Talleres Cercanos", desc: "Mecánicos de confianza en tu zona" },
    { icon: "🔒", title: "100% Seguro", desc: "Tus datos siempre protegidos" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <View style={appStyles.header}>
        <View style={homeStyles.headerRow}>
          <View>
            <Text style={appStyles.headerTitle}>AutoReach</Text>
            <Text style={appStyles.headerSubtitle}>
              {clienteNombre !== "..." ? `Bienvenido, ${clienteNombre}` : "Tu concesionario, siempre contigo"}
            </Text>
          </View>
          <Pressable style={homeStyles.logoutButton} onPress={onLogout}>
            <Text style={homeStyles.logoutText}>Salir</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={appStyles.content} showsVerticalScrollIndicator={false}>

        {/* Banner promocional */}
        <View style={homeStyles.promoBanner}>
          <Text style={homeStyles.promoTitle}>La plataforma integral del concesionario moderno</Text>
          <Text style={homeStyles.promoSubtitle}>Gestiona contratos, vehículos y servicios desde un solo lugar</Text>
        </View>

        {/* Feature cards horizontales */}
        <FlatList
          horizontal
          data={FEATURES}
          keyExtractor={f => f.title}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 4 }}
          style={{ marginBottom: 16 }}
          renderItem={({ item }) => (
            <View style={homeStyles.featureCard}>
              <Text style={homeStyles.featureIcon}>{item.icon}</Text>
              <Text style={homeStyles.featureTitle}>{item.title}</Text>
              <Text style={homeStyles.featureDesc}>{item.desc}</Text>
            </View>
          )}
        />

        <View style={appStyles.profileCard}>
          <Text style={appStyles.cardTitle}>Perfil del Conductor</Text>
          <Cliente nombre={clienteNombre} apellidos={clienteApellidos} clienteId={clienteId} />
        </View>

        <View style={appStyles.card}>
          <Text style={appStyles.cardTitle}>Seleccionar Vehículo</Text>
          <Text style={homeStyles.cardCaption}>Consulta el estado y ficha técnica de tu vehículo</Text>
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

        <View style={homeStyles.footerBanner}>
          <Text style={homeStyles.footerText}>AutoReach · Concesionarios de confianza</Text>
          <Text style={homeStyles.footerSub}>Transparencia y control total en cada transacción</Text>
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

const homeStyles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  logoutText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "600",
  },
  promoBanner: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  promoTitle: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  promoSubtitle: {
    color: colors.lightGray,
    fontSize: 12,
    lineHeight: 18,
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginRight: 10,
    width: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderTopWidth: 3,
    borderTopColor: colors.accent,
  },
  featureIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 11,
    color: "#888",
    lineHeight: 15,
  },
  cardCaption: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
    marginTop: -8,
    textAlign: "center",
    fontStyle: "italic",
  },
  footerBanner: {
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  footerText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footerSub: {
    color: colors.lightGray,
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
});

export default function App() {
  const [screen, setScreen] = useState<Screen>("Splash");

  function navigate(s: string) {
    setScreen(s as Screen);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setScreen("Login");
  }

  if (screen === "Splash") {
    return <SplashScreen onFinish={() => setScreen("Login")} />;
  }

  if (screen === "Login") {
    return <LoginScreen onLogin={() => setScreen("Home")} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={{ flex: 1 }}>
        {screen === "Home"      && <HomeScreen onLogout={handleLogout} />}
        {screen === "Talleres"  && <TalleresScreen />}
        {screen === "Documentos"&& <DocumentosScreen onNavigate={navigate} />}
      </View>
      <TabBar active={screen as Tab} onNavigate={(s) => setScreen(s)} />
    </View>
  );
}
