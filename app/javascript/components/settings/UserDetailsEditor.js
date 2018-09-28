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

        <div className="ph4 mt3 flex">
          <div className="w-50 pr3">
            <label className="f6 fw6 db mb1 gray ttc">First Name</label>
            <input className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner" />
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Last Name</label>
            <input className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner" />
          </div>
        </div>

      </div>
    )
  }
}

export default UserDetailsEditor
