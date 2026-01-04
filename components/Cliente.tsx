import { Pressable, Text, View, Modal, Alert, Image } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { clienteStyles } from "../Styles/styles";

export type clienteProp = {
  nombre: string;
  apellidos: string;
};
export function Cliente({ nombre, apellidos }: clienteProp) {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const cambiarFotoPerfil = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'Se necesita permiso para acceder a la cámara.'
      );
      return;
    }

    Alert.alert(
      'Cambiar foto de perfil',
      'Elige una opción',
      [
        {
          text: 'Tomar foto',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
            }
          }
        },
        {
          text: 'Elegir de galería',
          onPress: async () => {
            const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (galleryStatus !== 'granted') {
              Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería.');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
            }
          }
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <View style={clienteStyles.container}>
      <View style={clienteStyles.imageContainer}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Image
            source={profileImage ? { uri: profileImage } : require("../assets/user.png")}
            resizeMode="cover"
            style={clienteStyles.image}
          />
        </Pressable>
      </View>
      <Text style={clienteStyles.nombre}>{nombre}</Text>
      <Text style={clienteStyles.apellidos}>{apellidos}</Text>

      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <View style={clienteStyles.modalOverlay}>
          <View style={clienteStyles.modalContent}>
            <View style={clienteStyles.modalHeader}>
              <Text style={clienteStyles.modalTitle}>Perfil de Usuario</Text>
              <Pressable
                style={clienteStyles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={clienteStyles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <View style={clienteStyles.modalBody}>
              <View style={clienteStyles.profileImageContainer}>
                <Image
                  source={profileImage ? { uri: profileImage } : require("../assets/user.png")}
                  resizeMode="cover"
                  style={clienteStyles.profileImageLarge}
                />
                <Pressable
                  style={clienteStyles.cameraButton}
                  onPress={cambiarFotoPerfil}
                >
                  <Text style={clienteStyles.cameraButtonText}>📷</Text>
                </Pressable>
              </View>

              <Text style={clienteStyles.modalNombre}>{nombre}</Text>
              <Text style={clienteStyles.modalApellidos}>{apellidos}</Text>
            </View>

            <Pressable
              style={clienteStyles.backButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={clienteStyles.backButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}