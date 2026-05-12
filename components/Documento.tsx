import { Pressable, Text, View, Modal, Alert, StyleSheet } from 'react-native'
import React, { useState, useRef } from 'react'
import { documento } from '../model/Tipos'
import { firmaModalStyles, signatureWebStyle } from '../Styles/styles'
import { useTheme } from '../context/ThemeContext'
import SignatureScreen from 'react-native-signature-canvas'
import { firmarDocumentoDAO, actualizarPagoTransaccion } from '../database/ClienteDAO'
import { formatTipoDocumento, formatEstadoDocumento, formatFecha, formatImporte } from '../utils/formatters'

type Props = {
  doc: documento
  onFirmado: () => void
}

export function Documento({ doc, onFirmado }: Props) {
  const { colors } = useTheme()
  const [estadoLocal, setEstadoLocal] = useState(doc.estado_documento)
  const [mostrarModalFirma, setMostrarModalFirma] = useState(false)
  const signatureRef = useRef<any>(null)

  const estaFirmado = estadoLocal === 'FIRMADO'

  const handleOK = () => {
    setMostrarModalFirma(false)
    const firmadoPor = `${doc.cliente.nombre} ${doc.cliente.apellidos}`
    firmarDocumentoDAO(doc.id, firmadoPor)
      .then(() => actualizarPagoTransaccion(doc.transaccion.id))
      .then(() => {
        setEstadoLocal('FIRMADO')
        onFirmado()
        Alert.alert('Documento firmado', 'El documento ha sido firmado y la transacción marcada como pagada.')
      })
      .catch(() => {
        Alert.alert('Error', 'No se pudo firmar el documento. Inténtalo de nuevo.')
      })
  }

  const handleEmpty = () => {
    Alert.alert('Firma vacía', 'Dibuja tu firma antes de confirmar.')
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderLeftWidth: 3, borderLeftColor: colors.accent }]}>
      <View style={styles.row}>
        <Text style={[styles.tipo, { color: colors.text }]}>{formatTipoDocumento(doc.tipo_documento)}</Text>
        <View style={[styles.badge, estaFirmado ? styles.badgeFirmado : styles.badgePendiente]}>
          <Text style={[styles.badgeText, estaFirmado ? styles.badgeFirmadoText : styles.badgePendienteText]}>
            {formatEstadoDocumento(estadoLocal)}
          </Text>
        </View>
      </View>

      <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Transacción</Text>
        <Text style={[styles.value, { color: colors.text }]}>{doc.transaccion.tipo_transaccion}</Text>
      </View>
      <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Importe</Text>
        <Text style={[styles.value, { color: colors.text }]}>{formatImporte(doc.transaccion.monto_total)}</Text>
      </View>
      <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Pago</Text>
        <Text style={[styles.value, { color: colors.text }]}>{doc.transaccion.estado_pago}</Text>
      </View>
      <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Fecha</Text>
        <Text style={[styles.value, { color: colors.text }]}>{formatFecha(doc.fecha_creacion)}</Text>
      </View>
      {doc.fecha_firma && (
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textMuted }]}>Firmado el</Text>
          <Text style={[styles.value, { color: colors.text }]}>{formatFecha(doc.fecha_firma)}</Text>
        </View>
      )}

      {!estaFirmado && (
        <Pressable style={[styles.firmarBtn, { backgroundColor: colors.header, borderColor: colors.accent }]} onPress={() => setMostrarModalFirma(true)}>
          <Text style={[styles.firmarBtnText, { color: colors.accent }]}>Firmar documento</Text>
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
            onClear={() => {}}
            descriptionText=""
            webStyle={signatureWebStyle}
          />

          <View style={firmaModalStyles.buttonContainer}>
            <Pressable
              style={firmaModalStyles.clearButton}
              onPress={() => signatureRef.current?.clearSignature()}
            >
              <Text style={firmaModalStyles.clearButtonText}>Limpiar</Text>
            </Pressable>
            <Pressable
              style={firmaModalStyles.confirmButton}
              onPress={() => signatureRef.current?.readSignature()}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgePendiente: { backgroundColor: '#fff3cd' },
  badgeFirmado: { backgroundColor: '#d4edda' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  badgePendienteText: { color: '#856404' },
  badgeFirmadoText: { color: '#155724' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: { fontSize: 13, color: '#888' },
  value: { fontSize: 13, color: '#1a1a2e', fontWeight: '500' },
  firmarBtn: {
    marginTop: 14,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 11,
    alignItems: 'center',
  },
  firmarBtnText: { color: '#00d4ff', fontWeight: '700', fontSize: 14 },
})
