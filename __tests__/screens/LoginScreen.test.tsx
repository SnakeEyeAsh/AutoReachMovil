import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { LoginScreen } from '../../screens/LoginScreen'
import { supabase } from '../../database/supabase'

const mockSignIn = supabase.auth.signInWithPassword as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, status: 200 })
})

describe('LoginScreen — renderizado', () => {
  it('muestra el nombre de la app', () => {
    const { getByText } = render(<LoginScreen onLogin={() => {}} />)
    expect(getByText('AutoReach')).toBeTruthy()
  })

  it('muestra el campo de email', () => {
    const { getByPlaceholderText } = render(<LoginScreen onLogin={() => {}} />)
    expect(getByPlaceholderText('correo@ejemplo.com')).toBeTruthy()
  })

  it('muestra el campo de contraseña', () => {
    const { getByPlaceholderText } = render(<LoginScreen onLogin={() => {}} />)
    expect(getByPlaceholderText('••••••••')).toBeTruthy()
  })

  it('muestra el botón de entrar', () => {
    const { getByText } = render(<LoginScreen onLogin={() => {}} />)
    expect(getByText('Entrar')).toBeTruthy()
  })

  it('muestra los chips de características', () => {
    const { getByText } = render(<LoginScreen onLogin={() => {}} />)
    expect(getByText('🚗 Flota')).toBeTruthy()
    expect(getByText('📄 Contratos')).toBeTruthy()
    expect(getByText('🔧 Talleres')).toBeTruthy()
    expect(getByText('🔒 Seguro')).toBeTruthy()
  })
})

describe('LoginScreen — validación', () => {
  it('muestra error si email está vacío', () => {
    const { getByText } = render(<LoginScreen onLogin={() => {}} />)
    fireEvent.press(getByText('Entrar'))
    expect(getByText('Introduce tu email y contraseña.')).toBeTruthy()
  })

  it('muestra error si contraseña está vacía', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen onLogin={() => {}} />)
    fireEvent.changeText(getByPlaceholderText('correo@ejemplo.com'), 'test@test.com')
    fireEvent.press(getByText('Entrar'))
    expect(getByText('Introduce tu email y contraseña.')).toBeTruthy()
  })
})

describe('LoginScreen — autenticación', () => {
  it('llama a onLogin si las credenciales son correctas', async () => {
    mockSignIn.mockResolvedValueOnce({ error: null })
    const onLogin = jest.fn()
    const { getByText, getByPlaceholderText } = render(<LoginScreen onLogin={onLogin} />)

    fireEvent.changeText(getByPlaceholderText('correo@ejemplo.com'), 'user@test.com')
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'password123')
    fireEvent.press(getByText('Entrar'))

    await waitFor(() => expect(onLogin).toHaveBeenCalled())
  })

  it('muestra error si las credenciales son incorrectas', async () => {
    mockSignIn.mockResolvedValueOnce({
      error: { message: 'Invalid login credentials' },
    })
    const { getByText, getByPlaceholderText } = render(<LoginScreen onLogin={() => {}} />)

    fireEvent.changeText(getByPlaceholderText('correo@ejemplo.com'), 'mal@test.com')
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'wrongpass')
    fireEvent.press(getByText('Entrar'))

    await waitFor(() =>
      expect(getByText('Email o contraseña incorrectos.')).toBeTruthy()
    )
  })

  it('muestra error si el email no está confirmado', async () => {
    mockSignIn.mockResolvedValueOnce({
      error: { message: 'Email not confirmed' },
    })
    const { getByText, getByPlaceholderText } = render(<LoginScreen onLogin={() => {}} />)

    fireEvent.changeText(getByPlaceholderText('correo@ejemplo.com'), 'sin@confirmar.com')
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'pass')
    fireEvent.press(getByText('Entrar'))

    await waitFor(() =>
      expect(getByText('Confirma tu email antes de entrar.')).toBeTruthy()
    )
  })

  it('muestra error si la API no está disponible', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'))
    const { getByText, getByPlaceholderText } = render(<LoginScreen onLogin={() => {}} />)

    fireEvent.changeText(getByPlaceholderText('correo@ejemplo.com'), 'user@test.com')
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'pass')
    fireEvent.press(getByText('Entrar'))

    await waitFor(() =>
      expect(getByText('No se puede conectar al servidor. Comprueba tu conexión.')).toBeTruthy()
    )
  })
})
