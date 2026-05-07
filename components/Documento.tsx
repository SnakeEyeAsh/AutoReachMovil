import { Pressable, Text, View, Modal, Alert, StyleSheet } from 'react-native'
import React, { useState, useRef } from 'react'
import { documento } from '../model/Tipos'
import { firmaModalStyles, signatureWebStyle } from '../Styles/styles'
import SignatureScreen from 'react-native-signature-canvas'
import { firmarDocumentoDAO, actualizarPagoTransaccion } from '../database/ClienteDAO'

function formatTipo(tipo: string): string {
  return tipo.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
}

function formatEstado(estado: string): string {
  const map: Record<string, string> = {
    PENDIENTE_FIRMA: 'Pendiente de firma',
    FIRMADO: 'Firmado',
    CANCELADO: 'Cancelado',
  }
  return map[estado] ?? estado
}

type Props = {
  doc: documento
  onFirmado: () => void
}

export function Documento({ doc, onFirmado }: Props) {
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
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.tipo}>{formatTipo(doc.tipo_documento)}</Text>
        <View style={[styles.badge, estaFirmado ? styles.badgeFirmado : styles.badgePendiente]}>
          <Text style={[styles.badgeText, estaFirmado ? styles.badgeFirmadoText : styles.badgePendienteText]}>
            {formatEstado(estadoLocal)}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Transacción</Text>
        <Text style={styles.value}>{doc.transaccion.tipo_transaccion}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Importe</Text>
        <Text style={styles.value}>{doc.transaccion.monto_total.toLocaleString('es-ES')} €</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Pago</Text>
        <Text style={styles.value}>{doc.transaccion.estado_pago}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Fecha</Text>
        <Text style={styles.value}>{new Date(doc.fecha_creacion).toLocaleDateString('es-ES')}</Text>
      </View>
      {doc.fecha_firma && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Firmado el</Text>
          <Text style={styles.value}>{new Date(doc.fecha_firma).toLocaleDateString('es-ES')}</Text>
        </View>
      )}

      {!estaFirmado && (
        <Pressable style={styles.firmarBtn} onPress={() => setMostrarModalFirma(true)}>
          <Text style={styles.firmarBtnText}>Firmar documento</Text>
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
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  firmarBtnText: { color: '#00d4ff', fontWeight: '700', fontSize: 14 },
})
