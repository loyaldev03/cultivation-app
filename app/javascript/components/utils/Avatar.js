import React from 'react'
import PropTypes from 'prop-types'
import LetterAvatar from './LetterAvatar'

const Avatar = React.memo(({ firstName = '', lastName = '', photoUrl }) => {
  if (photoUrl && photoUrl.length >= 10) {
    // http://a.b
    return (
      <img
        src={photoUrl}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '18px'
        }}
      />
    )
  }
  if (firstName && lastName) {
    return (
      <LetterAvatar
        firstName={firstName}
        lastName={lastName}
        size={36}
        radius={18}
      />
    )
  }
  return <span>Show blank avatar</span>
})

Avatar.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  photoUrl: PropTypes.string
}

export default Avatar
