import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../Styles/styles";

type Props = {
  onFinish: () => void;
};

export function SplashScreen({ onFinish }: Props) {
  const logoScale   = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY       = useRef(new Animated.Value(20)).current;
  const tagOpacity  = useRef(new Animated.Value(0)).current;
  const ringScale   = useRef(new Animated.Value(0.6)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo aparece con escala
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Onda expansiva alrededor del logo
      Animated.parallel([
        Animated.timing(ringScale, {
          toValue: 1.6,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Nombre de la app aparece deslizándose hacia arriba
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(textY, {
          toValue: 0,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      // Tagline aparece
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Pausa antes de salir
      Animated.delay(800),
    ]).start(onFinish);
  }, []);

  return (
    <View style={styles.container}>
      {/* Círculos decorativos de fondo */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.circleOuter} />
        <View style={styles.circleMiddle} />
        <View style={styles.circleInner} />
      </View>

      {/* Logo con onda expansiva — centrado exactamente en el 50% de la pantalla */}
      <View style={styles.logoArea}>
        <Animated.View
          style={[styles.ring, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]}
        />
        <Animated.View
          style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
        >
          <Image
            source={require("../assets/coche.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Nombre y tagline — justo debajo del logo */}
      <View style={styles.textArea}>
        <Animated.Text
          style={[styles.appName, { opacity: textOpacity, transform: [{ translateY: textY }] }]}
        >
          AutoReach
        </Animated.Text>
        <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
          La plataforma del concesionario moderno
        </Animated.Text>
        <Animated.View style={[styles.line, { opacity: textOpacity }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  // Círculos decorativos
  circleOuter: {
    position: "absolute",
    width: 380,
    height: 380,
    top: "50%",
    left: "50%",
    marginTop: -190,
    marginLeft: -190,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    opacity: 0.06,
  },
  circleMiddle: {
    position: "absolute",
    width: 280,
    height: 280,
    top: "50%",
    left: "50%",
    marginTop: -140,
    marginLeft: -140,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    opacity: 0.1,
  },
  circleInner: {
    position: "absolute",
    width: 180,
    height: 180,
    top: "50%",
    left: "50%",
    marginTop: -90,
    marginLeft: -90,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    opacity: 0.15,
  },
  // Logo
  logoArea: {
    position: "absolute",
    width: 160,
    height: 160,
    top: "50%",
    left: "50%",
    marginTop: -80,
    marginLeft: -80,
    alignItems: "center",
    justifyContent: "center",
  },
  textArea: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    marginTop: 100,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  ring: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(0, 212, 255, 0.12)",
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 80,
    height: 80,
    tintColor: colors.accent,
  },
  // Texto
  appName: {
    fontSize: 42,
    fontWeight: "bold",
    color: colors.accent,
    letterSpacing: 3,
    textShadowColor: "rgba(0, 212, 255, 0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  tagline: {
    fontSize: 15,
    color: colors.lightGray,
    letterSpacing: 1.5,
    marginTop: 8,
    fontWeight: "300",
  },
  line: {
    width: 60,
    height: 2,
    backgroundColor: colors.accent,
    borderRadius: 1,
    marginTop: 20,
    opacity: 0.6,
  },
});
