import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StatusBar } from "react-native";
import { Documento } from "../components/Documento";
import { LoadingBar } from "../components/LoadingBar";
import { appStyles } from "../Styles/styles";
import { useTheme } from "../context/ThemeContext";
import { obtenerDocumentos } from "../database/ClienteDAO";
import { documento } from "../model/Tipos";

type Props = {
  onNavigate: (screen: string) => void;
};

export function DocumentosScreen({ onNavigate }: Props) {
  const { colors } = useTheme();
  const [documentosLista, setDocumentosLista] = useState<documento[]>([]);
  const [loading, setLoading] = useState(true);

  function cargarDocumentos() {
    setLoading(true);
    obtenerDocumentos()
      .then(setDocumentosLista)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    cargarDocumentos();
  }, []);

  return (
    <View style={[appStyles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.header} />
      <View style={[appStyles.header, { backgroundColor: colors.header }]}>
        <Text style={[appStyles.headerTitle, { color: colors.accent }]}>Documentos</Text>
        <Text style={[appStyles.headerSubtitle, { color: colors.textMuted }]}>Firma digital · Sin papeles · Al instante</Text>
      </View>
      <LoadingBar visible={loading} />

      <FlatList
        data={documentosLista}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Documento doc={item} onFirmado={cargarDocumentos} />
        )}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: colors.textMuted, marginTop: 40 }}>
            No hay documentos disponibles
          </Text>
        }
      />
    </View>
  );
}
