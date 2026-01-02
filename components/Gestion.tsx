import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { gestion } from '../model/Tipos'


export function Gestion({tipo,fecha,hora,matricula}:gestion) {
  return (
    <View style={styles.container}>
        <Text style={styles.tipo}>{tipo}</Text>
        <Text style={styles.fechaHora}>{fecha} {hora}</Text>
        <Text style={styles.matricula}>{matricula}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tipo: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  fechaHora: {
    fontSize: 20,
    color: '#000',
    fontWeight: '500',
    marginBottom: 2,
  },
  matricula: {
    fontSize: 14,
    color: '#333',
  },
})