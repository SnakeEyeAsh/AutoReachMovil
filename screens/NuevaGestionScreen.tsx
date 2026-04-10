import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { appStyles } from "../Styles/styles";
import { agregarGestion, obtenerMatriculas } from "../database/ClienteDAO";
import { gestion } from "../model/Tipos";

type Props = {
  onNavigate: (screen: string) => void;
};

export function NuevaGestionScreen({ onNavigate }: Props) {
  const [matriculas, setMatriculas] = useState<string[]>([]);
  const [nuevoTipo, setNuevoTipo] = useState("cita");
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");
  const [matriculaSeleccionada, setMatriculaSeleccionada] = useState("");
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  useEffect(() => {
    obtenerMatriculas()
      .then((mats) => {
        setMatriculas(mats);
        setMatriculaSeleccionada(mats[0] ?? "");
      })
      .catch(() => {});
  }, []);

  function guardar() {
    const nuevaGestionObj: gestion = {
      id: 0,
      tipo: nuevoTipo,
      fecha: nuevaFecha,
      hora: nuevaHora,
      matriculaRelacionada: matriculaSeleccionada,
    };
    agregarGestion(nuevaGestionObj)
      .then(() => onNavigate("Gestiones"))
      .catch(() => {});
  }

  return (
    <View style={appStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={appStyles.header}>
        <Text style={appStyles.headerTitle}>Nueva Cita</Text>
        <Text style={appStyles.headerSubtitle}>Agenda una gestión</Text>
      </View>

      <ScrollView style={appStyles.content} showsVerticalScrollIndicator={false}>
        <View style={appStyles.card}>
          <Text style={appStyles.label}>Tipo de Gestión</Text>
          <View style={appStyles.pickerContainer}>
            <Picker
              selectedValue={nuevoTipo}
              onValueChange={setNuevoTipo}
              style={appStyles.picker}
            >
              <Picker.Item label="Cita" value="cita" />
              <Picker.Item label="Taller" value="taller" />
            </Picker>
          </View>

          <Text style={appStyles.label}>Fecha</Text>
          <Pressable
            style={appStyles.inputField}
            onPress={() => setMostrarDatePicker(true)}
          >
            <Text style={{ color: nuevaFecha ? "#1a1a2e" : "#999" }}>
              {nuevaFecha || "Selecciona una fecha"}
            </Text>
          </Pressable>

          {mostrarDatePicker && (
            <DateTimePicker
              value={fechaSeleccionada}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setMostrarDatePicker(false);
                if (selectedDate) {
                  setFechaSeleccionada(selectedDate);
                  const year = selectedDate.getFullYear();
                  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                  const day = String(selectedDate.getDate()).padStart(2, "0");
                  setNuevaFecha(`${year}-${month}-${day}`);
                }
              }}
            />
          )}

          <Text style={appStyles.label}>Hora (HH:MM)</Text>
          <TextInput
            style={appStyles.inputField}
            value={nuevaHora}
            onChangeText={setNuevaHora}
            placeholder="14:30"
          />

          <Text style={appStyles.label}>Matrícula Relacionada</Text>
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
        </View>

        <Pressable style={appStyles.primaryButton} onPress={guardar}>
          <Text style={appStyles.primaryButtonText}>Guardar Gestión</Text>
        </Pressable>

        <Pressable
          style={[appStyles.backButton, { marginTop: 10 }]}
          onPress={() => onNavigate("Home")}
        >
          <Text style={appStyles.backButtonText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
