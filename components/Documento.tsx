import { Pressable, Text, View, Modal, Alert } from 'react-native'
import React, { useState, useRef } from 'react'
import { documento } from '../model/Tipos'
import { documentoStyles, firmaModalStyles, signatureWebStyle } from '../Styles/styles'
import SignatureScreen from 'react-native-signature-canvas'
import { firmarDocumentoDAO } from '../database/ClienteDAO'

export function Documento({id, estado, titulo, descripcion}: documento) {

  const [estadoLocal, setEstadoLocal] = useState(estado);
  const [mostrarModalFirma, setMostrarModalFirma] = useState(false);
  const signatureRef = useRef<any>(null);

  const estaFirmado = estadoLocal === "Firmado";

  const handleOK = () => {
    // console.log("Firma capturada:");
    setMostrarModalFirma(false);


    firmarDocumentoDAO(id)
      .then(() => {
        // console.log("Documento firmado correctamente");
        setEstadoLocal("Firmado");
        Alert.alert(
          "Documento firmado",
          "El documento ha sido firmado exitosamente."
        );
      })
      .catch((error: any) => {
        // console.error("Error al firmar el documento:", error);
        Alert.alert(
          "Error",
          "No se pudo firmar el documento. Por favor, intenta de nuevo."
        );
      });
  };

  const handleEmpty = () => {
    Alert.alert(
      "Firma vacía",
      "Por favor, dibuja tu firma antes de confirmar."
    );
  };

  const handleClear = () => {
    // console.log("Firma limpiada");
  };

  const handleLimpiar = () => {
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
    }
  };

  const handleConfirmar = () => {
    if (signatureRef.current) {
      signatureRef.current.readSignature();
    }
  };

  return (
    <View style={documentoStyles.container}>
      <Text style={documentoStyles.titulo}>{titulo}</Text>
      <Text style={documentoStyles.descripcion}>{descripcion}</Text>

      <View style={documentoStyles.estadoContainer}>
        <View
          style={[
            documentoStyles.estadoPin,
            estaFirmado ? documentoStyles.estadoPinFirmado : documentoStyles.estadoPinSinFirmar
          ]}
        />
        <Text style={documentoStyles.estadoTexto}>{estado}</Text>
      </View>

      {!estaFirmado && (
        <Pressable
          style={documentoStyles.firmarButton}
          onPress={() => setMostrarModalFirma(true)}
        >
          <Text style={documentoStyles.firmarButtonText}>Firmar</Text>
        </Pressable>
      )}

      <Modal
        visible={mostrarModalFirma}
        animationType="slide"
        onRequestClose={() => setMostrarModalFirma(false)}
      >
        <View style={firmaModalStyles.modalContainer}>
          <View style={firmaModalStyles.header}>
            <Text style={firmaModalStyles.headerText}>Firma del Documento</Text>
            <Text style={firmaModalStyles.subHeaderText}>Dibuja tu firma con el dedo</Text>
          </View>

          <SignatureScreen
            ref={signatureRef}
            onOK={handleOK}
            onEmpty={handleEmpty}
            onClear={handleClear}
            descriptionText=""
            webStyle={signatureWebStyle}
          />

          <View style={firmaModalStyles.buttonContainer}>
            <Pressable
              style={firmaModalStyles.clearButton}
              onPress={handleLimpiar}
            >
              <Text style={firmaModalStyles.clearButtonText}>Limpiar</Text>
            </Pressable>

            <Pressable
              style={firmaModalStyles.confirmButton}
              onPress={handleConfirmar}
            >
              <Text style={firmaModalStyles.confirmButtonText}>Confirmar</Text>
            </Pressable>
          </View>

          <Pressable
            style={firmaModalStyles.cancelButton}
            onPress={() => setMostrarModalFirma(false)}
          >
            <Text style={firmaModalStyles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  )
}