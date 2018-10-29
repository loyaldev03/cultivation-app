import React from 'react'
import PropTypes from 'prop-types'

export class Modal extends React.Component {
  render() {
    if (!this.props.show) {
      return null
    }
    return (
      <div className="fixed absolute--fill bg-black-30" tabIndex="0">
        {this.props.render(this.state)}
      </div>
    )
  }
}

Modal.propTypes = {
  render: PropTypes.func.isRequired,
  show: PropTypes.bool
}
