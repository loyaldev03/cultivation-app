import React from 'react'
import PropTypes from 'prop-types'
import LetterAvatar from './LetterAvatar'

const Avatar = React.memo(
  ({
    firstName = '',
    lastName = '',
    photoUrl,
    className,
    size = 36,
    backgroundColor = '#eee',
    showNoUser = false,
    onClick = () => {}
  }) => {
    if (showNoUser) {
      return (
        <div
          className="flex justify-center items-center fw6 white bg-black-20 pointer hover-bg-black-10"
          style={{
            width: size,
            height: size,
            backgroundSize: 'cover',
            borderRadius: '50%'
          }}
          onClick={onClick}
        >
          ?
        </div>
      )
    } else if (photoUrl && photoUrl.length >= 10) {
      // http://a.b
      return (
        <div
          className={className}
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
