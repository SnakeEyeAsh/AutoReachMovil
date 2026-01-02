import { StyleSheet, Text, View, Image} from "react-native";
import React from "react";
import { coche } from "../model/Tipos";
import { cocheStyles } from "../Styles/styles";


export function Coche({ marca, modelo, matricula, kilometros }: coche) {
  return (
    <View style={cocheStyles.container}>
      <View>
        <Text style={cocheStyles.marca}>{marca}</Text>
        <Text style={cocheStyles.modelo}>{modelo}</Text>
      </View>

      <View style={cocheStyles.imageContainer}>
        <Image
          resizeMode="contain"
          source={require("../assets/coche.png")}
          style={cocheStyles.cocheImage}
        />
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
