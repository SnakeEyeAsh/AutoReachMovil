import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { TabBar } from '../../components/TabBar'

describe('TabBar', () => {
  it('renderiza las tres pestañas', () => {
    const { getByText } = render(<TabBar active="Home" onNavigate={() => {}} />)
    expect(getByText('Inicio')).toBeTruthy()
    expect(getByText('Talleres')).toBeTruthy()
    expect(getByText('Docs')).toBeTruthy()
  })

  it('llama a onNavigate con "Talleres" al pulsar la pestaña', () => {
    const onNavigate = jest.fn()
    const { getByText } = render(<TabBar active="Home" onNavigate={onNavigate} />)
    fireEvent.press(getByText('Talleres'))
    expect(onNavigate).toHaveBeenCalledWith('Talleres')
  })

  it('llama a onNavigate con "Documentos" al pulsar Docs', () => {
    const onNavigate = jest.fn()
    const { getByText } = render(<TabBar active="Home" onNavigate={onNavigate} />)
    fireEvent.press(getByText('Docs'))
    expect(onNavigate).toHaveBeenCalledWith('Documentos')
  })

  it('la pestaña activa llama a onNavigate igualmente', () => {
    const onNavigate = jest.fn()
    const { getByText } = render(<TabBar active="Talleres" onNavigate={onNavigate} />)
    fireEvent.press(getByText('Talleres'))
    expect(onNavigate).toHaveBeenCalledWith('Talleres')
  })
})
