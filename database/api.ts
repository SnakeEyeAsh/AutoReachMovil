import AsyncStorage from '@react-native-async-storage/async-storage'

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://35.202.97.203:3000/api'

const TOKEN_KEY = 'auth_token'
const CLIENTE_KEY = 'auth_cliente'

export async function setAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token)
}

export async function clearAuthToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY)
  await AsyncStorage.removeItem(CLIENTE_KEY)
}

export async function setAuthCliente(cliente: object): Promise<void> {
  await AsyncStorage.setItem(CLIENTE_KEY, JSON.stringify(cliente))
}

export async function getAuthCliente(): Promise<any | null> {
  const raw = await AsyncStorage.getItem(CLIENTE_KEY)
  return raw ? JSON.parse(raw) : null
}

async function getToken(): Promise<string> {
  const token = await AsyncStorage.getItem(TOKEN_KEY)
  if (token) return token
  throw new Error('No autenticado')
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error ?? `Error ${response.status}`)
  }
  if (response.status === 204) return undefined as T
  return response.json()
}

export async function apiLogin(email: string, password: string): Promise<{
  token: string
  cliente: { id: number; nombre: string; apellidos: string; email: string }
}> {
  const res = await fetch(`${BASE_URL}/clientes/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await handleResponse<any>(res)
  await setAuthToken(data.token)
  await setAuthCliente(data.cliente)
  return data
}

export async function apiGet<T>(path: string): Promise<T> {
  const token = await getToken()
  return fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse<T>)
}

export async function apiPost<T>(path: string, body: object): Promise<T> {
  const token = await getToken()
  return fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  }).then(handleResponse<T>)
}

export async function apiPut<T>(path: string, body: object): Promise<T> {
  const token = await getToken()
  return fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  }).then(handleResponse<T>)
}

export async function apiDelete(path: string): Promise<void> {
  const token = await getToken()
  return fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse<void>)
}

export async function apiUploadImage(path: string, imageUri: string): Promise<void> {
  const form = new FormData()
  form.append('imagen', { uri: imageUri, type: 'image/jpeg', name: 'perfil.jpg' } as any)
  return fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    body: form,
  }).then(handleResponse<void>)
}

export async function apiGetImage(path: string): Promise<string | null> {
  try {
    const token = await getToken()
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return null
    const contentType = response.headers.get('Content-Type') ?? 'image/jpeg'
    const buffer = await response.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    const chunkSize = 8192
    let binary = ''
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
    }
    return `data:${contentType};base64,${btoa(binary)}`
  } catch {
    return null
  }
}
