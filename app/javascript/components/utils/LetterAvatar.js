import React from 'react'
import PropTypes from 'prop-types'

const letterColours = [
  [226, 95, 81], // A
  [93, 188, 210], // B
  [252, 114, 68], // C
  [206, 68, 252], // D
  [120, 132, 205], // E
  [91, 149, 249], // F
  [72, 194, 249], // G
  [201, 62, 109], // H
  [72, 182, 172], // I
  [222, 116, 55], // J
  [155, 206, 95], // K
  [219, 174, 39], // L
  [100, 204, 65], // M
  [247, 192, 0], // N
  [255, 168, 0], // O
  [255, 138, 96], // P
  [38, 168, 220], // Q
  [5, 51, 111], // R
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
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  size: PropTypes.number,
  radius: PropTypes.any
}

const defaultProps = {
  firstName: '',
  lastName: '',
  size: 38,
  radius: 19
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
        bgColor = getColorCode(lastName[0])
      }
      if (firstName) {
        initials = firstName[0] + initials
        bgColor = getColorCode(firstName[0])
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
        cursor: 'default',
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
        cursor: 'default',
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
