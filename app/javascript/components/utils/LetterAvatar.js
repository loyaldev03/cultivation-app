import React from 'react'
import PropTypes from 'prop-types'

const letterColours = [
  [226, 95, 81], // A
  [242, 96, 145], // B
  [187, 101, 202], // C
  [149, 114, 207], // D
  [120, 132, 205], // E
  [91, 149, 249], // F
  [72, 194, 249], // G
  [69, 208, 226], // H
  [72, 182, 172], // I
  [82, 188, 137], // J
  [155, 206, 95], // K
  [212, 227, 74], // L
  [254, 218, 16], // M
  [247, 192, 0], // N
  [255, 168, 0], // O
  [255, 138, 96], // P
  [194, 194, 194], // Q
  [143, 164, 175], // R
  [162, 136, 126], // S
  [63, 163, 163], // T
  [175, 181, 226], // U
  [179, 155, 221], // V
  [194, 194, 194], // W
  [124, 222, 235], // X
  [188, 170, 64], // Y
  [173, 214, 125] // Z
]

const propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  radius: PropTypes.number
}

const defaultProps = {
  name: 'X',
  size: 50,
  radius: 0
}

const getColorCode = charA => {
  let bgColor
  if (/[A-Z]/.test(charA)) {
    bgColor = letterColours[charA.charCodeAt() - 65]
  } else if (/[\d]/.test(charA)) {
    bgColor = letterColours[parseInt(charA)]
  } else {
    bgColor = [0, 0, 0]
  }
  return bgColor
}
class LetterAvatar extends React.PureComponent {
  render() {
    const { firstName = '', lastName = '', size, radius } = this.props
    if (firstName || lastName) {
      let initials = ''
      let bgColor
      if (lastName) {
        initials = initials + lastName[0]
        bgColor = getColorCode(initials)
      }
      if (firstName) {
        initials = firstName[0] + initials
        if (!bgColor) {
          bgColor = getColorCode(firstName[0])
        }
      }

      const style = {
        backgroundColor: `rgb(${bgColor})`,
        width: size,
        height: size,
        fontSize: size / 3 / 11 + 'em',
        fontWeight: '600',
        lineHeight: size + 'px',
        color: 'rgba(233,233,233,0.9)',
        textAlign: 'center',
        display: 'inline-block',
        borderRadius: radius
      }

      return <span style={style}>{initials}</span>
    } else {
      let bgColor = [222, 222, 222]
      const style = {
        backgroundColor: `rgb(${bgColor})`,
        width: size,
        height: size,
        fontSize: '1em',
        lineHeight: size + 'px',
        color: 'rgba(233,233,233,0.9)',
        textAlign: 'center',
        display: 'inline-block',
        borderRadius: radius
      }
      return <span style={style} />
    }
  }
}

LetterAvatar.propTypes = propTypes
LetterAvatar.defaultProps = defaultProps

export default LetterAvatar
