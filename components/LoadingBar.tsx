import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { useTheme } from '../context/ThemeContext'

export function LoadingBar({ visible }: { visible: boolean }) {
  const { colors } = useTheme()
  const position = useRef(new Animated.Value(-0.4)).current

  useEffect(() => {
    if (visible) {
      position.setValue(-0.4)
      Animated.loop(
        Animated.timing(position, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: false,
        })
      ).start()
    } else {
      position.stopAnimation()
    }
  }, [visible])

  if (!visible) return null

  return (
    <View style={[styles.track, { backgroundColor: `${colors.accent}22` }]}>
      <Animated.View
        style={[
          styles.bar,
          {
            backgroundColor: colors.accent,
            left: position.interpolate({
              inputRange: [-0.4, 1],
              outputRange: ['-40%', '100%'],
            }),
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: 'rgba(0,212,255,0.15)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    width: '40%',
    height: '100%',
    backgroundColor: '#00d4ff',
    borderRadius: 10,
  },
})
