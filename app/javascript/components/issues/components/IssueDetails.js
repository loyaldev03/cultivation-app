import React, { Component } from 'react'
import Avatar from '../../utils/Avatar.js'

const renderSeverity = value => {
  if (value === 'high') {
    return (
      <div className="tc ttc">
        <i className="material-icons red" style={{ fontSize: '18px' }}>
          error
        </i>
      </div>
    )
  } else if (value === 'medium') {
    return (
      <div className="tc ttc">
        <i className="material-icons gold" style={{ fontSize: '18px' }}>
          warning
        </i>
      </div>
    )
  } else {
    return (
      <div className="tc ttc">
        <span className="f6 fw4 purple">FYI</span>
      </div>
    )
  }
}

class IssueDetails extends Component {
  toggleEdit = event => {
    this.props.onToggleMode()
    event.preventDefault()
  }

  render() {
    return (
      <React.Fragment>
        <div className="ph4 flex">
          <a href="#" onClick={this.toggleEdit} className="orange f6 link mt3">
            Temp Edit toggle
          </a>
        </div>
        <div
          className="ph4 pv2 b--light-gray flex items-center"
          style={{ height: '51px' }}
        >
          <div className="flex w-100">
            <div className="w-auto pv3 mr2">
              <Avatar firstName="John" lastName="Doe" size={25} />
            </div>
            <div className="f6 gray w-auto pv3 ph2 mt1 mr2">ISSUE #002</div>
            <div className="f6 green flex f6 green fw6 w-auto pv3 mt1 mr2">
              OPEN
            </div>
            <div className="f6 flex f6 green fw6 w-auto pv3 mt1 mr2">
              {renderSeverity('high')}
            </div>
          </div>

          <span
            className="rc-slide-panel__close-button dim"
            onClick={this.props.onClose}
          >
            <i className="material-icons mid-gray md-18">close</i>
          </span>
        </div>

        <div className="ph4">
          <div className="flex w-100">
            <div className="w-auto pv3 mr2">
              <Avatar firstName="Michael" lastName="Doe" size={25} />
            </div>
            <div className="f5 dark-gray w-auto pv3 ph2 lh-title">
              Batch needs additional 25 clone kits because we are going to
              finish them today.
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default IssueDetails
