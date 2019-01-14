import React from 'react'
import PropTypes from 'prop-types'
import LetterAvatar from './LetterAvatar'

const Avatar = React.memo(
  ({
    firstName = '',
    lastName = '',
    photoUrl,
    size = 36,
    backgroundColor = '#eee'
  }) => {
    if (photoUrl && photoUrl.length >= 10) {
      // http://a.b
      return (
        <div
          style={{
            background: `url(${photoUrl}) no-repeat center center`,
            backgroundColor,
            width: size,
            height: size,
            backgroundSize: 'cover',
            borderRadius: '50%'
          }}
        />
      )
    }

    return (
      <LetterAvatar
        firstName={firstName}
        lastName={lastName}
        size={size}
        radius="50%"
      />
    )
  }
)

Avatar.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  photoUrl: PropTypes.string
}

export default Avatar
