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
import { appStyles, colors } from "../Styles/styles";
import { useTheme } from "../context/ThemeContext";

interface Props {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: Props) {
  const { colors: tc } = useTheme();
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
      style={[loginStyles.container, { backgroundColor: tc.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={tc.header} />

      <View style={[loginStyles.header, { backgroundColor: tc.header }]}>
        <Text style={[loginStyles.logo, { color: tc.accent }]}>AutoReach</Text>
        <Text style={[loginStyles.subtitle, { color: tc.textMuted }]}>La plataforma del concesionario moderno</Text>
      </View>

      <View style={[loginStyles.form, { backgroundColor: tc.surface, borderColor: tc.border }]}>
        <Text style={[loginStyles.title, { color: tc.text }]}>Accede a tu cuenta</Text>

        <Text style={[appStyles.label, { color: tc.text }]}>Email</Text>
        <TextInput
          style={[appStyles.inputField, { backgroundColor: tc.input, borderColor: tc.inputBorder, color: tc.text }]}
          placeholder="correo@ejemplo.com"
          placeholderTextColor={tc.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[appStyles.label, { color: tc.text }]}>Contraseña</Text>
        <View style={[loginStyles.passwordContainer, { backgroundColor: tc.input, borderColor: tc.inputBorder }]}>
          <TextInput
            style={[loginStyles.passwordInput, { color: tc.text }]}
            placeholder="••••••••"
            placeholderTextColor={tc.textMuted}
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
          style={[appStyles.primaryButton, { backgroundColor: tc.accent }, loading && loginStyles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={tc.header} />
          ) : (
            <Text style={[appStyles.primaryButtonText, { color: tc.header }]}>Entrar</Text>
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
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.accent,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.lightGray,
    fontWeight: "300",
    textAlign: "center",
  },
  form: {
    margin: 20,
    marginTop: 20,
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 18,
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
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.accent,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    color: colors.primary,
  },
  eyeButton: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeText: {
    fontSize: 16,
  },
});
