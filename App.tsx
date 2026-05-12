import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  Pressable,
  Modal,
  StyleSheet,
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
import { TalleresScreen } from "./screens/TalleresScreen";
import { DocumentosScreen } from "./screens/DocumentosScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { SplashScreen } from "./screens/SplashScreen";
import { TabBar } from "./components/TabBar";
import { LoadingBar } from "./components/LoadingBar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { supabase } from "./database/supabase";

type Tab = "Home" | "Talleres" | "Documentos";
type Screen = "Splash" | "Login" | Tab;

function HomeScreen({ onLogout }: { onLogout: () => void }) {
  const { colors, isDark, toggle } = useTheme();
  const [clienteNombre, setClienteNombre] = useState("...");
  const [clienteApellidos, setClienteApellidos] = useState("...");
  const [clienteId, setClienteId] = useState(0);
  const [matriculaSeleccionada, setMatriculaSeleccionada] = useState("");
  const [matriculas, setMatriculas] = useState<string[]>([]);
  const [coche, setCoche] = useState<coche>();
  const [mostrarCoche, setMostrarCoche] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let pending = 2;
    const done = () => { if (--pending === 0) setLoading(false); };

    obtenerMatriculas()
      .then((mats) => {
        setMatriculas(mats);
        setMatriculaSeleccionada(mats[0] ?? "");
      })
      .catch(() => {})
      .finally(done);

    obtenerCliente()
      .then((c) => {
        setClienteId(c.id);
        setClienteNombre(c.nombre);
        setClienteApellidos(c.apellidos);
      })
      .catch(() => {})
      .finally(done);
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.header} />

      <View style={[appStyles.header, { backgroundColor: colors.header }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[appStyles.headerTitle, { color: colors.accent }]}>AutoReach</Text>
            <Text style={[appStyles.headerSubtitle, { color: colors.textMuted }]}>
              {clienteNombre !== "..." ? `Bienvenido, ${clienteNombre}` : "Tu concesionario, siempre contigo"}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={[styles.themeBtn, { borderColor: colors.border }]} onPress={toggle}>
              <Text style={styles.themeBtnText}>{isDark ? "☀️" : "🌙"}</Text>
            </Pressable>
            <Pressable style={[styles.logoutBtn, { borderColor: colors.accent }]} onPress={onLogout}>
              <Text style={[styles.logoutText, { color: colors.accent }]}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <LoadingBar visible={loading} />

      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={appStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[appStyles.profileCard, { backgroundColor: colors.card, borderLeftWidth: 3, borderLeftColor: colors.accent }]}>
          <Text style={[appStyles.cardTitle, { color: colors.text }]}>Perfil del Conductor</Text>
          <Cliente nombre={clienteNombre} apellidos={clienteApellidos} clienteId={clienteId} />
        </View>

        <View style={[appStyles.card, { backgroundColor: colors.card, borderLeftWidth: 3, borderLeftColor: colors.accent }]}>
          <Text style={[appStyles.cardTitle, { color: colors.text }]}>Seleccionar Vehículo</Text>
          <Text style={[styles.cardCaption, { color: colors.textMuted }]}>Consulta el estado y ficha técnica de tu vehículo</Text>
          <Text style={[appStyles.label, { color: colors.text }]}>Matrícula</Text>
          <View style={[appStyles.pickerContainer, { backgroundColor: colors.input, borderColor: colors.inputBorder }]}>
            <Picker
              selectedValue={matriculaSeleccionada}
              onValueChange={setMatriculaSeleccionada}
              style={[appStyles.picker, { color: colors.text }]}
              dropdownIconColor={colors.accent}
            >
              {matriculas.map((mat) => (
                <Picker.Item key={mat} label={mat} value={mat} />
              ))}
            </Picker>
          </View>
          <Pressable style={[appStyles.primaryButton, { backgroundColor: colors.accent }]} onPress={verCoche}>
            <Text style={[appStyles.primaryButtonText, { color: colors.header }]}>Ver Coche</Text>
          </Pressable>
        </View>
      </ScrollView>

      {mostrarCoche && (
        <Modal transparent animationType="fade">
          <View style={[appStyles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.75)' }]}>
            <View style={[appStyles.modalContent, { backgroundColor: colors.surface }]}>
              <View style={[appStyles.modalHeader, { borderBottomColor: colors.accent }]}>
                <Text style={[appStyles.modalTitle, { color: colors.text }]}>Vehículo</Text>
                <Pressable style={appStyles.closeButton} onPress={() => setMostrarCoche(false)}>
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
                    año={coche.año}
                  />
                )}
              </View>
              <Pressable
                style={[appStyles.backButton, { backgroundColor: colors.header, borderColor: colors.accent }]}
                onPress={() => setMostrarCoche(false)}
              >
                <Text style={[appStyles.backButtonText, { color: colors.accent }]}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  themeBtn: {
    borderWidth: 1,
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  themeBtnText: {
    fontSize: 14,
  },
  logoutBtn: {
    borderWidth: 1,
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: "600",
  },
  cardCaption: {
    fontSize: 11,
    marginBottom: 8,
    marginTop: -6,
    textAlign: "center",
    fontStyle: "italic",
  },
});

function AppNavigator() {
  const [screen, setScreen] = useState<Screen>("Splash");

  function navigate(s: string) { setScreen(s as Screen); }

  async function handleLogout() {
    await supabase.auth.signOut();
    setScreen("Login");
  }

  if (screen === "Splash") return <SplashScreen onFinish={() => setScreen("Login")} />;
  if (screen === "Login")  return <LoginScreen onLogin={() => setScreen("Home")} />;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {screen === "Home"       && <HomeScreen onLogout={handleLogout} />}
        {screen === "Talleres"   && <TalleresScreen />}
        {screen === "Documentos" && <DocumentosScreen onNavigate={navigate} />}
      </View>
      <TabBar active={screen as Tab} onNavigate={(s) => setScreen(s)} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
