import React from 'react'
import PropTypes from 'prop-types'

export const GroupBox = ({ title, render, className = '' }) => {
  return (
    <div className={`groupbox ${className}`}>
      <span className="groupbox__title">{title}</span>
      {render()}
    </div>
  )
}

GroupBox.propTypes = {
  render: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string
}
