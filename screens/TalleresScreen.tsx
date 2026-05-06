import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, Modal, Pressable,
  ActivityIndicator, Linking, StatusBar,
} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import * as Location from 'expo-location'

const GOOGLE_MAPS_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY ?? ''
const SEARCH_RADIUS = 5000

type Mechanic = {
  place_id: string
  name: string
  vicinity: string
  geometry: { location: { lat: number; lng: number } }
  rating?: number
  opening_hours?: { open_now: boolean }
}

type MechanicDetail = {
  name: string
  formatted_phone_number?: string
  formatted_address?: string
  website?: string
  rating?: number
  opening_hours?: { open_now: boolean }
}

async function fetchNearbyMechanics(lat: number, lng: number): Promise<Mechanic[]> {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${SEARCH_RADIUS}&type=car_repair&language=es&key=${GOOGLE_MAPS_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  return data.results ?? []
}

async function fetchPlaceDetails(placeId: string): Promise<MechanicDetail | null> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,formatted_address,website,rating,opening_hours&language=es&key=${GOOGLE_MAPS_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  return data.result ?? null
}

export function TalleresScreen() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mechanics, setMechanics] = useState<Mechanic[]>([])
  const [selected, setSelected] = useState<MechanicDetail | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') {
        setPermissionDenied(true)
        setLoadingLocation(false)
        return
      }
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
        .then((pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setLocation({ lat, lng })
          fetchNearbyMechanics(lat, lng).then(setMechanics).catch(() => {})
        })
        .finally(() => setLoadingLocation(false))
    })
  }, [])

  async function handleMarkerPress(mechanic: Mechanic) {
    setSelected(null)
    setLoadingDetail(true)
    setModalVisible(true)
    const detail = await fetchPlaceDetails(mechanic.place_id).catch(() => null)
    setSelected(detail)
    setLoadingDetail(false)
  }

  if (loadingLocation) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
      </View>
    )
  }

  if (permissionDenied || !location) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <Text style={styles.errorText}>
          Se necesita permiso de ubicación para mostrar talleres cercanos.
        </Text>
      </View>
    )
  }

  const region: Region = {
    latitude: location.lat,
    longitude: location.lng,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Talleres Cercanos</Text>
        <Text style={styles.headerSubtitle}>
          {mechanics.length > 0
            ? `${mechanics.length} talleres encontrados`
            : 'Buscando talleres...'}
        </Text>
      </View>

      <MapView
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
      >
        {mechanics.map((m) => (
          <Marker
            key={m.place_id}
            coordinate={{
              latitude: m.geometry.location.lat,
              longitude: m.geometry.location.lng,
            }}
            title={m.name}
            description={m.vicinity}
            pinColor="#00d4ff"
            onPress={() => handleMarkerPress(m)}
          />
        ))}
      </MapView>

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            {loadingDetail ? (
              <ActivityIndicator size="large" color="#00d4ff" style={{ marginVertical: 32 }} />
            ) : selected ? (
              <>
                <Text style={styles.modalName}>{selected.name}</Text>

                {selected.opening_hours && (
                  <View
                    style={[
                      styles.badge,
                      selected.opening_hours.open_now ? styles.badgeOpen : styles.badgeClosed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: selected.opening_hours.open_now ? '#155724' : '#721c24' },
                      ]}
                    >
                      {selected.opening_hours.open_now ? 'Abierto ahora' : 'Cerrado'}
                    </Text>
                  </View>
                )}

                {selected.rating != null && (
                  <Text style={styles.rating}>
                    {'★'.repeat(Math.round(selected.rating))}{'☆'.repeat(5 - Math.round(selected.rating))}
                    {'  '}{selected.rating.toFixed(1)}
                  </Text>
                )}

                {selected.formatted_address && (
                  <Text style={styles.address}>{selected.formatted_address}</Text>
                )}

                {selected.formatted_phone_number && (
                  <Pressable
                    style={styles.actionRow}
                    onPress={() => Linking.openURL(`tel:${selected!.formatted_phone_number}`)}
                  >
                    <Text style={styles.phone}>{selected.formatted_phone_number}</Text>
                    <Text style={styles.actionHint}>Llamar</Text>
                  </Pressable>
                )}

                {selected.website && (
                  <Pressable
                    style={styles.actionRow}
                    onPress={() => Linking.openURL(selected!.website!)}
                  >
                    <Text style={styles.website}>Sitio web</Text>
                    <Text style={styles.actionHint}>Abrir</Text>
                  </Pressable>
                )}
              </>
            ) : (
              <Text style={styles.address}>No se pudo cargar la información.</Text>
            )}

            <Pressable style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>Cerrar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 32,
  },
  loadingText: { marginTop: 14, color: '#555', fontSize: 15 },
  errorText: { color: '#555', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  header: {
    backgroundColor: '#1a1a2e',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  headerSubtitle: { color: '#00d4ff', fontSize: 13, marginTop: 2 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000066',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
  },
  modalName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  badgeOpen: { backgroundColor: '#d4edda' },
  badgeClosed: { backgroundColor: '#f8d7da' },
  badgeText: { fontSize: 13, fontWeight: '600' },
  rating: { color: '#f5a623', fontSize: 16, marginBottom: 10 },
  address: { color: '#555', fontSize: 14, lineHeight: 20, marginBottom: 10 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 12,
  },
  phone: { color: '#1a1a2e', fontSize: 16, fontWeight: '600' },
  website: { color: '#007AFF', fontSize: 15 },
  actionHint: { color: '#00d4ff', fontSize: 13, fontWeight: '600' },
  closeBtn: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 14,
  },
  closeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
