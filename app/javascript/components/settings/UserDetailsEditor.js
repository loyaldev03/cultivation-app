import React from 'react'
import classNames from 'classnames'

class UserDetailsEditor extends React.PureComponent {
  render() {
    const { onClose } = this.props
    return (
      <div className="h-100 flex flex-column">
        <div className="ph4 pv3 bb b--light-grey">
          <h5 className="h6--font dark-grey ma0">User Details</h5>
          <a
            href="#0"
            className="slide-panel__close-button dim"
            onClick={onClose}
          >
            <i className="material-icons mid-gray md-18 pa1">close</i>
          </a>
        </div>
      </div>
    )
  }
}

export default UserDetailsEditor
