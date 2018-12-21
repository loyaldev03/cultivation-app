import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const ActiveBadge = React.memo(({ isActive, className }) => {
  return (
    <span
      className={classNames(`f7 fw4 ph2 pv1 ba br2 dib w2 tc ${className}`, {
        'grey b--grey': !isActive,
        'bg-green b--green white': isActive
      })}
    >
      {isActive ? 'Active' : 'Draft'}
    </span>
  )
})

ActiveBadge.propTypes = {
  className: PropTypes.string,
  isActive: PropTypes.bool.isRequired
}

export { ActiveBadge }
