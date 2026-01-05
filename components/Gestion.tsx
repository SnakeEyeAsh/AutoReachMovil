import { Pressable, Text, View, Modal, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import { gestion } from "../model/Tipos";
import { gestionStyles, appStyles } from "../Styles/styles";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export function Gestion({ id, tipo, fecha, hora, matriculaRelacionada, index, borrado, modifiacado}: gestion) {

  const fechaActual = new Date().toISOString().split('T')[0];

  const estado = fecha < fechaActual ? "Completada" : "Pendiente";

  // Estados para el modal de edición
  const [modalEdicion, setModalEdicion] = useState(false);
  const [tipoEditable, setTipoEditable] = useState(tipo);
  const [fechaEditable, setFechaEditable] = useState(fecha);
  const [horaEditable, setHoraEditable] = useState(hora);
  const [matriculaEditable, setMatriculaEditable] = useState(matriculaRelacionada);
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date(fecha));

  const abrirModalEdicion = () => {
    setTipoEditable(tipo);
    setFechaEditable(fecha);
    setHoraEditable(hora);
    setMatriculaEditable(matriculaRelacionada);
    setModalEdicion(true);
  };

  const guardarCambios = () => {
    const gestionModificada: gestion = {
      id,
      tipo: tipoEditable,
      fecha: fechaEditable,
      hora: horaEditable,
      matriculaRelacionada: matriculaEditable,
      index,
      borrado,
      modifiacado
    };
    if (modifiacado) {
      modifiacado(gestionModificada);
    }
    setModalEdicion(false);
  };

  return (
    <>
      <Modal transparent={true} animationType="fade" visible={modalEdicion}>
        <View style={appStyles.modalOverlay}>
          <View style={appStyles.modalContent}>
            <View style={appStyles.modalHeader}>
              <Text style={appStyles.modalTitle}>Editar Gestión</Text>
              <Pressable
                style={appStyles.closeButton}
                onPress={() => setModalEdicion(false)}
              >
                <Text style={appStyles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={appStyles.label}>Tipo de Gestión</Text>
              <View style={appStyles.pickerContainer}>
                <Picker
                  selectedValue={tipoEditable}
                  onValueChange={(itemValue) => setTipoEditable(itemValue)}
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
                <Text style={{ color: fechaEditable ? "#1a1a2e" : "#999" }}>
                  {fechaEditable || "Selecciona una fecha"}
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
                      setFechaEditable(`${year}-${month}-${day}`);
                    }
                  }}
                />
              )}

              <Text style={appStyles.label}>Hora (HH:MM)</Text>
              <TextInput
                style={appStyles.inputField}
                value={horaEditable}
                onChangeText={setHoraEditable}
                placeholder="14:30"
              />

              <Text style={appStyles.label}>Matrícula Relacionada</Text>
              <TextInput
                style={appStyles.inputField}
                value={matriculaEditable}
                onChangeText={setMatriculaEditable}
                placeholder="Matrícula"
              />
            </ScrollView>

            <Pressable
              style={appStyles.primaryButton}
              onPress={guardarCambios}
            >
              <Text style={appStyles.primaryButtonText}>
                Guardar Cambios
              </Text>
            </Pressable>

            <Pressable
              style={appStyles.backButton}
              onPress={() => setModalEdicion(false)}
            >
              <Text style={appStyles.backButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={gestionStyles.container}>
        <Text style={gestionStyles.tipo}>{tipo}</Text>
        <Text style={gestionStyles.fecha}>Fecha: {fecha}</Text>
        <Text style={gestionStyles.hora}>Hora: {hora}</Text>
        <View>
          <Text style={gestionStyles.matricula}>{matriculaRelacionada}</Text>
        </View>
        <View style={gestionStyles.estadoContainer}>
          <View style={fecha < fechaActual ? gestionStyles.pin2:gestionStyles.pin1}></View>
          <Text style={gestionStyles.tipo}>{estado}</Text>
        </View>
        <View style={gestionStyles.buttonsContainer}>
          <Pressable style={gestionStyles.updateButton} onPress={abrirModalEdicion}>
            <Text style={gestionStyles.deleteButtonText}>Modificar</Text>
          </Pressable>

          <Pressable style={gestionStyles.deleteButton} onPress={borrado}>
            <Text style={gestionStyles.deleteButtonText}>Borrar</Text>
          </Pressable>

        </View>
      </View>
    </>
  );
}
