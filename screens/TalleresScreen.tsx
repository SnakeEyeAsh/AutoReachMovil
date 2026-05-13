import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, Modal, Pressable,
  ActivityIndicator, Linking, StatusBar,
} from 'react-native'
import { WebView } from 'react-native-webview'
import * as Location from 'expo-location'
import { useTheme } from '../context/ThemeContext'

const SEARCH_RADIUS = 5000

type Mechanic = {
  id: number
  name: string
  lat: number
  lng: number
  phone?: string | null
  address?: string | null
  opening_hours?: string | null
  website?: string | null
}

async function fetchNearbyMechanics(lat: number, lng: number): Promise<Mechanic[]> {
  const ar = `(around:${SEARCH_RADIUS},${lat},${lng})`
  const query = `[out:json][timeout:30];
(
  nwr["shop"~"car_repair|tyres|car_parts|car_service"]${ar};
  nwr["craft"~"car_repair|mechanic|automobile_repair|car_painter"]${ar};
  nwr["amenity"~"car_repair|vehicle_inspection"]${ar};
);
out center tags;`

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  })
  const data = await res.json()

  return (data.elements as any[])
    .map(el => {
      const elLat = el.lat ?? el.center?.lat
      const elLng = el.lon ?? el.center?.lon
      const t = el.tags ?? {}
      const addr = [t['addr:street'], t['addr:housenumber'], t['addr:city']]
        .filter(Boolean).join(', ') || t['addr:full'] || null
      return {
        id: el.id,
        name: t.name ?? t['brand'] ?? 'Taller sin nombre',
        lat: elLat,
        lng: elLng,
        phone: t.phone ?? t['contact:phone'] ?? null,
        address: addr,
        opening_hours: t.opening_hours ?? null,
        website: t.website ?? t['contact:website'] ?? null,
      }
    })
    .filter(m => m.lat && m.lng)
}

function buildMapHTML(lat: number, lng: number, mechanics: Mechanic[]): string {
  const markersJS = mechanics.map(m => `
    L.marker([${m.lat},${m.lng}],{icon:shopIcon}).addTo(map).on('click',function(){
      window.ReactNativeWebView.postMessage(JSON.stringify({
        id:${m.id},name:${JSON.stringify(m.name)},lat:${m.lat},lng:${m.lng},
        phone:${JSON.stringify(m.phone)},address:${JSON.stringify(m.address)},
        opening_hours:${JSON.stringify(m.opening_hours)},website:${JSON.stringify(m.website)}
      }));
    });
  `).join('')

  return `<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>*{margin:0;padding:0;box-sizing:border-box}html,body,#map{width:100%;height:100%}.leaflet-control-attribution{font-size:9px}</style>
</head><body><div id="map"></div><script>
var map=L.map('map',{zoomControl:true}).setView([${lat},${lng}],14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
var userIcon=L.divIcon({className:'',html:'<div style="width:16px;height:16px;background:#00d4ff;border:3px solid #fff;border-radius:50%;box-shadow:0 0 8px rgba(0,212,255,0.9)"></div>',iconSize:[16,16],iconAnchor:[8,8]});
var shopIcon=L.divIcon({className:'',html:'<div style="width:14px;height:14px;background:#ff6b35;border:2px solid #fff;border-radius:50%;box-shadow:0 0 5px rgba(255,107,53,0.8)"></div>',iconSize:[14,14],iconAnchor:[7,7]});
L.marker([${lat},${lng}],{icon:userIcon}).addTo(map).bindPopup('Tu ubicación');
${markersJS}
</script></body></html>`
}

export function TalleresScreen() {
  const { colors } = useTheme()
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mechanics, setMechanics] = useState<Mechanic[]>([])
  const [loadingLocation, setLoadingLocation] = useState(true)
  const [loadingMechanics, setLoadingMechanics] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [selected, setSelected] = useState<Mechanic | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') {
        setPermissionDenied(true)
        setLoadingLocation(false)
        return
      }
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
        .then(pos => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setLocation({ lat, lng })
          setLoadingMechanics(true)
          fetchNearbyMechanics(lat, lng)
            .then(setMechanics)
            .catch(() => {})
            .finally(() => setLoadingMechanics(false))
        })
        .finally(() => setLoadingLocation(false))
    })
  }, [])

  function handleMessage(event: any) {
    try {
      const mechanic: Mechanic = JSON.parse(event.nativeEvent.data)
      setSelected(mechanic)
      setModalVisible(true)
    } catch {}
  }

  if (loadingLocation) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.header} />
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>Obteniendo ubicación...</Text>
      </View>
    )
  }

  if (permissionDenied || !location) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.header} />
        <Text style={[styles.errorText, { color: colors.textMuted }]}>
          Se necesita permiso de ubicación para mostrar talleres cercanos.
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.header} />

      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Talleres Cercanos</Text>
        <Text style={[styles.headerSubtitle, { color: colors.accent }]}>
          {loadingMechanics
            ? 'Localizando talleres de confianza...'
            : `${mechanics.length} talleres verificados en tu zona`}
        </Text>
      </View>

      <WebView
        style={{ flex: 1 }}
        originWhitelist={['*']}
        source={{ html: buildMapHTML(location.lat, location.lng, mechanics) }}
        onMessage={handleMessage}
        javaScriptEnabled
      />

      {loadingMechanics && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color="#00d4ff" />
          <Text style={styles.loadingOverlayText}>Buscando talleres...</Text>
        </View>
      )}

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: colors.surface }]} onPress={() => {}}>
            {selected && (
              <>
                <Text style={[styles.modalName, { color: colors.text }]}>{selected.name}</Text>

                {selected.opening_hours && (
                  <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                    <Text style={styles.infoIcon}>🕐</Text>
                    <Text style={[styles.infoText, { color: colors.textMuted }]}>{selected.opening_hours}</Text>
                  </View>
                )}

                {selected.address && (
                  <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                    <Text style={styles.infoIcon}>📍</Text>
                    <Text style={[styles.infoText, { color: colors.textMuted }]}>{selected.address}</Text>
                  </View>
                )}

                {selected.phone && (
                  <Pressable
                    style={[styles.infoRow, styles.actionRow, { borderTopColor: colors.border }]}
                    onPress={() => Linking.openURL(`tel:${selected.phone}`)}
                  >
                    <Text style={styles.infoIcon}>📞</Text>
                    <Text style={[styles.infoText, styles.actionText, { color: colors.text }]}>{selected.phone}</Text>
                    <Text style={[styles.actionHint, { color: colors.accent }]}>Llamar</Text>
                  </Pressable>
                )}

                {selected.website && (
                  <Pressable
                    style={[styles.infoRow, styles.actionRow, { borderTopColor: colors.border }]}
                    onPress={() => Linking.openURL(selected.website!)}
                  >
                    <Text style={styles.infoIcon}>🌐</Text>
                    <Text style={[styles.infoText, styles.actionText, { color: colors.text }]}>Sitio web</Text>
                    <Text style={[styles.actionHint, { color: colors.accent }]}>Abrir</Text>
                  </Pressable>
                )}
              </>
            )}

            <Pressable style={[styles.closeBtn, { backgroundColor: colors.header }]} onPress={() => setModalVisible(false)}>
              <Text style={[styles.closeBtnText, { color: colors.accent }]}>Cerrar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#f5f5f5', padding: 32,
  },
  loadingText: { marginTop: 14, color: '#555', fontSize: 15 },
  errorText: { color: '#555', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  header: {
    backgroundColor: '#1a1a2e',
    paddingTop: (StatusBar.currentHeight ?? 0) + 12,
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSubtitle: { color: '#00d4ff', fontSize: 13, marginTop: 2 },
  loadingOverlay: {
    position: 'absolute', bottom: 16, alignSelf: 'center',
    backgroundColor: '#1a1a2e', borderRadius: 20,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, gap: 8,
    elevation: 6,
  },
  loadingOverlayText: { color: '#00d4ff', fontSize: 13 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000066' },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, paddingBottom: 36,
  },
  modalName: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 8 },
  actionRow: {
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
    paddingTop: 12, marginBottom: 0,
  },
  infoIcon: { fontSize: 16, marginTop: 1 },
  infoText: { flex: 1, fontSize: 14, color: '#444', lineHeight: 20 },
  actionText: { color: '#1a1a2e', fontWeight: '600' },
  actionHint: { color: '#00d4ff', fontSize: 13, fontWeight: '600' },
  closeBtn: {
    backgroundColor: '#1a1a2e', borderRadius: 10,
    paddingVertical: 13, alignItems: 'center', marginTop: 16,
  },
  closeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
