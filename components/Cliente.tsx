import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'

export type clienteProp={
    nombre:string
    apellidos:string
}
export function Cliente({nombre,apellidos}:clienteProp) {
  return (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
            <Image
            source={require('../assets/user.png')}
            contentFit='cover'
            style={styles.image}
            />
        </View>
      <Text style={styles.nombre}>{nombre}</Text>
      <Text style={styles.apellidos}>{apellidos}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  imageContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#00d4ff'
  },
  nombre: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#1a1a2e'
  },
  apellidos: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400'
  }
})