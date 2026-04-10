import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  StatusBar,
} from "react-native";
import { Gestion } from "../components/Gestion";
import { appStyles } from "../Styles/styles";
import {
  obtenerGestiones,
  borrarGestionDAO,
  modificarGestionDAO,
} from "../database/ClienteDAO";
import { gestion } from "../model/Tipos";

type Props = {
  onNavigate: (screen: string) => void;
};

export function GestionesScreen({ onNavigate }: Props) {
  const [gestionesLista, setGestionesLista] = useState<gestion[]>([]);

  function cargarGestiones() {
    obtenerGestiones()
      .then(setGestionesLista)
      .catch(() => {});
  }

  useEffect(() => {
    cargarGestiones();
  }, []);

  function borrarGestionHandler(id: number) {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas borrar esta gestión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: () => {
            borrarGestionDAO(id)
              .then(cargarGestiones)
              .catch(() => {});
          },
        },
      ]
    );
  }

  function modificarGestionHandler(g: gestion) {
    modificarGestionDAO(g)
      .then(cargarGestiones)
      .catch(() => {});
  }

  return (
    <View style={appStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={appStyles.header}>
        <Text style={appStyles.headerTitle}>Gestiones</Text>
        <Text style={appStyles.headerSubtitle}>Historial de transacciones</Text>
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
            modifiacado={modificarGestionHandler}
            borrado={() => borrarGestionHandler(item.id)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#999", marginTop: 40 }}>
            No hay gestiones registradas
          </Text>
        }
      />

      <Pressable
        style={[appStyles.primaryButton, { margin: 16 }]}
        onPress={() => onNavigate("NuevaGestion")}
      >
        <Text style={appStyles.primaryButtonText}>+ Agendar Nueva Cita</Text>
      </Pressable>
    </View>
  );
}
