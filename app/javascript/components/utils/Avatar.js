import React from 'react'
import PropTypes from 'prop-types'
import LetterAvatar from './LetterAvatar'

const Avatar = React.memo(
  ({ firstName = '', lastName = '', photoUrl, size = 36 }) => {
    if (photoUrl && photoUrl.length >= 10) {
      const width = size
      // http://a.b
      return (
        <img
          src={photoUrl}
          style={{
            width,
            height: width,
            borderRadius: size / 2
          }}
        />
      )
    }
    if (firstName && lastName) {
      return (
        <LetterAvatar
          firstName={firstName}
          lastName={lastName}
          size={size}
          radius={size / 2}
        />
      )
    }
    return <span>Show blank avatar</span>
  }
)

Avatar.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  photoUrl: PropTypes.string
}

export default Avatar
