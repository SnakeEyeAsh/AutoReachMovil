import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StatusBar } from "react-native";
import { Documento } from "../components/Documento";
import { appStyles } from "../Styles/styles";
import { obtenerDocumentos } from "../database/ClienteDAO";
import { documento } from "../model/Tipos";

type Props = {
  onNavigate: (screen: string) => void;
};

export function DocumentosScreen({ onNavigate }: Props) {
  const [documentosLista, setDocumentosLista] = useState<documento[]>([]);

  function cargarDocumentos() {
    obtenerDocumentos()
      .then(setDocumentosLista)
      .catch(() => {});
  }

  useEffect(() => {
    cargarDocumentos();
  }, []);

  return (
    <View style={appStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={appStyles.header}>
        <Text style={appStyles.headerTitle}>Documentos</Text>
        <Text style={appStyles.headerSubtitle}>Firma digital · Sin papeles · Al instante</Text>
      </View>

      <FlatList
        data={documentosLista}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Documento
            doc={item}
            onFirmado={cargarDocumentos}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#999", marginTop: 40 }}>
            No hay documentos disponibles
          </Text>
        }
      />
    </View>
  );
}
