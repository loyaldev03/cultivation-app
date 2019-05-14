import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const PortalModal = ({ show, render }) =>
  show
    ? ReactDOM.createPortal(
      <div className="fixed absolute--fill bg-black-30" tabIndex="0">
        {render()}
      </div>,
      document.querySelector('#root-portal')
    )
    : null

export { PortalModal }
