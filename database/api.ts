import { supabase } from './supabase'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000/api'

async function getToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No autenticado')
  return session.access_token
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error ?? `Error ${response.status}`)
  }
  if (response.status === 204) return undefined as T
  return response.json()
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

// Sube imagen como multipart/form-data (ruta pública, sin auth)
export async function apiUploadImage(path: string, imageUri: string): Promise<void> {
  const form = new FormData()
  form.append('imagen', { uri: imageUri, type: 'image/jpeg', name: 'perfil.jpg' } as any)
  return fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    body: form,
  }).then(handleResponse<void>)
}

// Descarga imagen con auth (GET /api/me/imagen) y la devuelve como data URI base64
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
