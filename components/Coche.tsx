import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { coche } from "../model/Tipos";
import { cocheStyles, colors } from "../Styles/styles";
import { fetchCarPhotos } from "../services/autoDevService";

export function Coche({ marca, modelo, matricula, kilometros, año }: coche) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setPhotoUrl(null)
    fetchCarPhotos(marca, modelo, año)
      .then((photos) => setPhotoUrl(photos[0] ?? null))
      .finally(() => setLoading(false))
  }, [marca, modelo, año])

  return (
    <View style={cocheStyles.container}>
      <View>
        <Text style={cocheStyles.marca}>{marca}</Text>
        <Text style={cocheStyles.modelo}>{modelo}</Text>
      </View>

      <View style={cocheStyles.imageContainer}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            resizeMode="contain"
            style={cocheStyles.cocheImage}
          />
        ) : (
          <Image
            source={require("../assets/coche.png")}
            resizeMode="contain"
            style={cocheStyles.cocheImage}
          />
        )}
      </View>

      <Text style={cocheStyles.matricula}>{matricula}</Text>

      <View style={cocheStyles.kilometrosContainer}>
        <Text style={cocheStyles.label}>Kilometraje</Text>
        <Text style={cocheStyles.kilometros}>
          {kilometros.toLocaleString()} km
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
