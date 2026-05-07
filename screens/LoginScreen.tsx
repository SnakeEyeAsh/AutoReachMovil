import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "../database/supabase";
import { colors, appStyles } from "../Styles/styles";

interface Props {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError("Introduce tu email y contraseña.");
      return;
    }

    setLoading(true);
    setError("");

    // Verificar que la API está disponible antes de continuar
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000/api';
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 15000)
      );
      const check = await Promise.race([
        fetch(`${apiUrl}/clientes?search=ping`),
        timeout,
      ]) as Response;
      console.log('[login] API check status:', check.status);
    } catch (e: any) {
      console.log('[login] API check error:', e?.message);
      setLoading(false);
      setError("No se puede conectar al servidor. Comprueba tu conexión.");
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (authError) {
      if (authError.message.includes("Email not confirmed")) {
        setError("Confirma tu email antes de entrar.");
      } else if (authError.message.includes("Invalid login")) {
        setError("Email o contraseña incorrectos.");
      } else {
        setError(authError.message);
      }
    } else {
      onLogin();
    }
  }

  return (
    <KeyboardAvoidingView
      style={loginStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={loginStyles.header}>
        <Text style={loginStyles.logo}>AutoReach</Text>
        <Text style={loginStyles.subtitle}>La plataforma del concesionario moderno</Text>
        <View style={loginStyles.chipsRow}>
          {["🚗 Flota", "📄 Contratos", "🔧 Talleres", "🔒 Seguro"].map(c => (
            <View key={c} style={loginStyles.chip}>
              <Text style={loginStyles.chipText}>{c}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={loginStyles.form}>
        <Text style={loginStyles.title}>Accede a tu cuenta</Text>
        <Text style={loginStyles.formSubtitle}>Gestiona tu vehículo, firma contratos y encuentra talleres desde un solo lugar.</Text>

        <Text style={appStyles.label}>Email</Text>
        <TextInput
          style={appStyles.inputField}
          placeholder="correo@ejemplo.com"
          placeholderTextColor={colors.lightGray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={appStyles.label}>Contraseña</Text>
        <View style={loginStyles.passwordContainer}>
          <TextInput
            style={loginStyles.passwordInput}
            placeholder="••••••••"
            placeholderTextColor={colors.lightGray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable
            style={loginStyles.eyeButton}
            onPress={() => setShowPassword((v) => !v)}
          >
            <Text style={loginStyles.eyeText}>{showPassword ? "🙈" : "👁️"}</Text>
          </Pressable>
        </View>

        {error !== "" && <Text style={loginStyles.error}>{error}</Text>}

        <Pressable
          style={[appStyles.primaryButton, loading && loginStyles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={appStyles.primaryButtonText}>Entrar</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 80,
    paddingBottom: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logo: {
    fontSize: 40,
    fontWeight: "bold",
    color: colors.accent,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.lightGray,
    fontWeight: "300",
    marginBottom: 14,
    textAlign: "center",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
  },
  chip: {
    backgroundColor: "rgba(0,212,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.4)",
  },
  chipText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "600",
  },
  formSubtitle: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 19,
    marginTop: -10,
  },
  form: {
    padding: 30,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 25,
    textAlign: "center",
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.accent,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: colors.primary,
  },
  eyeButton: {
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeText: {
    fontSize: 18,
  },
});
