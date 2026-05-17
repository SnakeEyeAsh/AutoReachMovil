import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { LoginScreen } from '../../screens/LoginScreen'

jest.mock('../../database/api', () => ({
  apiLogin: jest.fn(),
}))

import { apiLogin } from '../../database/api'
const mockApiLogin = apiLogin as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
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
  it('llama a onLogin con los datos del cliente si las credenciales son correctas', async () => {
    const cliente = { id: 1, nombre: 'Juan', apellidos: 'García', email: 'user@test.com' }
    mockApiLogin.mockResolvedValueOnce({ token: 'tok', cliente })
    const onLogin = jest.fn()
    const { getByText, getByPlaceholderText } = render(<LoginScreen onLogin={onLogin} />)

    fireEvent.changeText(getByPlaceholderText('correo@ejemplo.com'), 'user@test.com')
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'password123')
    fireEvent.press(getByText('Entrar'))

    await waitFor(() => expect(onLogin).toHaveBeenCalledWith(cliente))
  })

  it('muestra error si las credenciales son incorrectas', async () => {
    mockApiLogin.mockRejectedValueOnce(new Error('401 credenciales inválidas'))
    const { getByText, getByPlaceholderText } = render(<LoginScreen onLogin={() => {}} />)

    fireEvent.changeText(getByPlaceholderText('correo@ejemplo.com'), 'mal@test.com')
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'wrongpass')
    fireEvent.press(getByText('Entrar'))

    await waitFor(() =>
      expect(getByText('Email o contraseña incorrectos.')).toBeTruthy()
    )
  })

  it('muestra error si la API no está disponible', async () => {
    mockApiLogin.mockRejectedValueOnce(new Error('Network Error'))
    const { getByText, getByPlaceholderText } = render(<LoginScreen onLogin={() => {}} />)

    fireEvent.changeText(getByPlaceholderText('correo@ejemplo.com'), 'user@test.com')
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'pass')
    fireEvent.press(getByText('Entrar'))

    await waitFor(() =>
      expect(getByText('No se puede conectar al servidor. Comprueba tu conexión.')).toBeTruthy()
    )
  })
})
