const React = require('react')
const { Text } = require('react-native')

const Ionicons = ({ name, size, color }) =>
  React.createElement(Text, { testID: `icon-${name}`, style: { color, fontSize: size } }, name)

module.exports = { Ionicons }
