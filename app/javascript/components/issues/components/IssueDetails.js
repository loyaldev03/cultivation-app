import React, { Component } from 'react'
import Avatar from '../../utils/Avatar.js'
import Comments from './Comments'

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
          <div className="flex w-100 ph0 items-center pt3">
            <div className="w-auto">
              <Avatar
                firstName="Sample"
                lastName="User"
                photoUrl=""
                size={25}
              />
            </div>
            <div className="f7 fw6 gray w-auto ph2 mr1">
              ISSUE #001
              <div style={{ fontSize: '10px' }} className="pt1">
                Dec 12, 4:01pm
              </div>
            </div>
            <div className="f7 fw6 gray w-auto mr1 self-start pt1">&bull;</div>
            <div className="f7 fw6 green w-auto self-start pt1 ph1">OPEN</div>
            <div className="f6 fw6 gray w-auto ph1 self-start pt1">
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
          <div
            style={{
              borderLeft: '2px solid #e8e8e8',
              height: '25px',
              marginLeft: '11px'
            }}
          />
        </div>

        <div className="ph4">
          <div className="flex w-100">
            <div className="w-auto pv2 mr2">
              <Avatar firstName="Michael" lastName="Doe" size={25} />
            </div>
            <div className="flex flex-column">
              <div className="f6 b gray w-auto pv2 lh-title">
                Batch needs additional 25 clone kits because we are going to
                finish them today.
              </div>
              <div className="f6 gray w-auto pv2 lh-title">
                Maybe we can order from Joe as the last batch quality was quite
                good
              </div>
              <div className="flex">
                {/* Attachment Placeholder */}
                <div
                  className="mr2"
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#bbbbbb',
                    borderRadius: '3px'
                  }}
                />
                <div
                  className="mr2"
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#bbbbbb',
                    borderRadius: '3px'
                  }}
                />
                <div
                  className="mr2"
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#bbbbbb',
                    borderRadius: '3px'
                  }}
                />
                {/* Attachment Placeholder End */}
              </div>
              <div className="mt3">
                <a href="#" className="orange f6 link mt3">
                  Show more
                </a>
              </div>
            </div>
          </div>
        </div>
        <hr className="w-100"></hr>
        <Comments />
      </React.Fragment>
    )
  }
}

export default IssueDetails
