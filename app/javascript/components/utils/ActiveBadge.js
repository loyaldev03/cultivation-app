import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { BATCH_STATUS } from './'

const ActiveBadge = React.memo(({ status, className = '' }) => {
  return (
    <span
      className={classNames(`f7 fw6 ph3 pv1 ba br2 dib tc ${className}`, {
        'grey b--grey': status === BATCH_STATUS.DRAFT,
        'bg-orange b--orange white': status === BATCH_STATUS.SCHEDULED,
        'bg-green b--green white':
          status === BATCH_STATUS.ACTIVE || status === 'open'
      })}
    >
      {status}
    </span>
  )
})

ActiveBadge.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string.isRequired
}

export { ActiveBadge }
