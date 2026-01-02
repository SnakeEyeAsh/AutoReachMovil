import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Cliente } from './components/Cliente'
import { Picker } from '@react-native-picker/picker'


export default function App() {
  const [matriculaSeleccionada, setMatriculaSeleccionada] = useState('ABC1234')
  const [matriculaSecundaria, setMatriculaSecundaria] = useState('')

  const matriculas = ['ABC1234', 'XYZ5678', 'DEF9012', 'GHI3456']

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AutoReach</Text>
        <Text style={styles.headerSubtitle}>Gestión de tu vehículo</Text>
      </View>

      <ScrollView style={styles.content}>
        
        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>Perfil del Conductor</Text>
          <Cliente nombre={'Pepe'} apellidos={'Gonzales'}/>
        </View>

        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Seleccionar Vehículo</Text>

          <Text style={styles.label}>Matrícula Principal</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={matriculaSeleccionada}
              onValueChange={(itemValue) => setMatriculaSeleccionada(itemValue)}
              style={styles.picker}
            >
              {matriculas.map((mat) => (
                <Picker.Item key={mat} label={mat} value={mat} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Matrícula Secundaria (Opcional)</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={matriculaSecundaria}
              onValueChange={(itemValue) => setMatriculaSecundaria(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Ninguna" value="" />
              {matriculas.map((mat) => (
                <Picker.Item key={mat} label={mat} value={mat} />
              ))}
            </Picker>
          </View>
        </View>

        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acciones Rápidas</Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() => console.log('Ver gestiones')}
          >
            <Text style={styles.primaryButtonText}>📋 Ver Gestiones Realizadas</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => console.log('Agendar cita')}
          >
            <Text style={styles.secondaryButtonText}>📅 Agendar Nueva Cita</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 5
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#b8b8b8',
    fontWeight: '300'
  },
  content: {
    flex: 1,
    padding: 20
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 15,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a2e',
    marginBottom: 8,
    marginTop: 10
  },
  pickerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00d4ff',
    marginBottom: 15,
    overflow: 'hidden'
  },
  picker: {
    height: 50,
    color: '#1a1a2e'
  },
  primaryButton: {
    backgroundColor: '#00d4ff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6
  },
  primaryButtonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  secondaryButton: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00d4ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  secondaryButtonText: {
    color: '#00d4ff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})