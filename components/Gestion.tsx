import { Pressable, Text, View } from "react-native";
import React from "react";
import { gestion } from "../model/Tipos";
import { gestionStyles } from "../Styles/styles";

export function Gestion({ id, tipo, fecha, hora, matriculaRelacionada, index, borrado, modifiacado}: gestion) {

  const fechaActual = new Date().toISOString().split('T')[0];

  const estado = fecha < fechaActual ? "Completada" : "Pendiente";


  return (
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
        <Pressable style={gestionStyles.updateButton} onPress={modifiacado}>
          <Text style={gestionStyles.deleteButtonText}>Modificar</Text>
        </Pressable>

        <Pressable style={gestionStyles.deleteButton} onPress={borrado}>
          <Text style={gestionStyles.deleteButtonText}>Borrar</Text>
        </Pressable>

      </View>
    </View>
  );
}
