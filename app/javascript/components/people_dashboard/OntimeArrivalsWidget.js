import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import Tippy from '@tippy.js/react'
import { PeopleUserListWidget, Loading, NoData, DefaultAvatar } from '../utils'
import LetterAvatar from '../utils/LetterAvatar'
import PeopleDashboardStore from './PeopleDashboardStore'
const MenuButton = ({ icon, text, onClick, className = '' }) => {
  return (
    <a
      className={`pa2 flex link dim pointer items-center ${className}`}
      onClick={onClick}
    >
      <i className="material-icons md-17 pr2">{icon}</i>
      <span className="pr2">{text}</span>
    </a>
  )
}
const ProgressBar = React.memo(
  ({
    height = 10,
    percent = 0,
    className = '',
    show = true,
    barColor = 'bg-orange'
  }) => {
    if (!show) return null
    const style = {
      width: `${percent}%`,
      height: height
    }
    return (
      <div
        className={`bg-moon-gray br-pill overflow-y-hidden dib ${className}`}
        style={{ height: height, width: '300px' }}
      >
        <div className={` br-pill shadow-1 ${barColor}`} style={style} />
      </div>
    )
  }
)

const orders = [
  {
    text: 'Most On Time',
    val: 'ontime'
  },
  {
    text: 'Most Late',
    val: 'late'
  }
]

const roleInit = {
  role_name: 'All Job Roles',
  role_id: ''
}

@observer
class OntimeArrivalsWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: { text: 'Most On Time', val: 'ontime' },
      role: { role_name: 'All Job Roles', role_id: '' },
      average: 0
    }
  }

  getProgressBarColor(value) {
    if (value >= 70) {
      return 'bg-green'
    }
    if (value < 50) {
      return 'bg-red'
    }
    if (value >= 50 && value < 70) {
      return 'bg-yellow'
    }
  }

  onChangeRoles = role => {
    this.setState({ role: role }, () => {
      PeopleDashboardStore.loadOnTimeArrival(
        this.props.facility_id,
        this.state.order.val,
        role.role_id
      )
    })
  }

  onChangeOrder = order => {
    this.setState({ order: order }, () => {
      PeopleDashboardStore.loadOnTimeArrival(
        this.props.facility_id,
        order.val,
        this.state.role.role_id
      )
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">On Time Arrivals</h1>
          <div className="flex">
            <Tippy
              placement="bottom-end"
              trigger="click"
              duration="0"
              content={
                <div className="bg-white f6 flex">
                  <div className="db shadow-4">
                    <MenuButton
                      key={roleInit.role_name}
                      text={'All Job Roles'}
                      className=""
                      onClick={() => this.onChangeRoles(roleInit)}
                    />
                    {PeopleDashboardStore.roles_loaded
                      ? PeopleDashboardStore.data_roles.map(d => (
                          <MenuButton
                            key={d.role_id}
                            text={d.role_name}
                            className=""
                            onClick={() => this.onChangeRoles(d)}
                          />
                        ))
                      : <Loading/>}
                  </div>
                </div>
              }
            >
              <div className="flex ba b--light-silver br2 pointer dim">
                <h1 className="f6 fw6 ml2 grey ttc">
                  {this.state.role.role_name}
                </h1>
                <i className="material-icons grey mr2  md-21 mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </Tippy>
            <Tippy
              placement="bottom-end"
              trigger="click"
              duration="0"
              content={
                <div className="bg-white f6 flex">
                  <div className="db shadow-4">
                    {orders.map(d => (
                      <MenuButton
                        key={d.val}
                        text={d.text}
                        className=""
                        onClick={() => this.onChangeOrder(d)}
                      />
                    ))}
                  </div>
                </div>
              }
            >
              <div className="flex ba b--light-silver br2 pointer dim">
                <h1 className="f6 fw6 ml2 grey ttc">{this.state.order.text}</h1>
                <i className="material-icons grey mr2  md-21 mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </Tippy>
          </div>
        </div>
        <div className="flex pb3">
          {PeopleDashboardStore.ontime_arrival_loaded
            ? PeopleDashboardStore.data_ontime_arrival.average != null
              ? `Average: ${PeopleDashboardStore.data_ontime_arrival.average.toFixed(
                  2
                )} %`
              : 'Average: 0 %'
            : ''}
        </div>
        {PeopleDashboardStore.ontime_arrival_loaded
          ? PeopleDashboardStore.data_ontime_arrival.data.length != 0
            ? PeopleDashboardStore.data_ontime_arrival.data.map((e, i) => (
                <div className="flex justify-between mb3 pt2" key={`section_user_${i}`}>
                  <div className="flex items-center w-40">
                    {e.user.photo_url ? (
                      <div>
                        <img
                          src={e.user.photo_url}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '18px'
                          }}
                          onError={x => {
                            x.target.onerror = null
                            x.target.src = DefaultAvatar
                          }}
                        />
                      </div>
                    ) : (
                      <LetterAvatar
                        firstName={e.user.first_name}
                        lastName={e.user.last_name}
                        size={36}
                        radius={18}
                      />
                    )}
                    <span className="f6 fw6 dark-grey ml2">
                      {e.user.first_name} {e.user.last_name}
                      <div className="f6 fw6 grey">{e.roles}</div>
                    </span>
                  </div>
                  <div className="flex items-center w-60" key={i}>
                    <ProgressBar
                      percent={e.percentage}
                      height={10}
                      barColor={this.getProgressBarColor(e.percentage)}
                    />
                    <span className="f6 fw6 dark-grey ml2 w-20">
                      {e.percentage.toFixed(2)} %
                    </span>
                  </div>
                </div>
              ))
            : <NoData/>
          : <Loading/>}
      </React.Fragment>
    )
  }
}

export default OntimeArrivalsWidget
