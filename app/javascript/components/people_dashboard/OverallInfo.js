import React from 'react'
import { observer } from 'mobx-react'
import Tippy from '@tippy.js/react'
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

@observer
export default class OverallInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedMonth: 'All'
    }
  }

  onChangeMonthly = range => {
    this.setState({ selectedMonth: range.split('_').join(' ') }, () => {
      PeopleDashboardStore.loadOverallInfo(
        this.props.facility_id,
        this.state.selectedMonth
      )
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-between">
          <div>
            <h1 className="f5 fw6 ml4 dark-grey">Overall Info</h1>
          </div>
          <Tippy
            placement="bottom-end"
            trigger="click"
            duration="0"
            content={
              <div className="bg-white f6 flex">
                <div className="db shadow-4">
                  <MenuButton
                    text="All"
                    className=""
                    onClick={() => this.onChangeMonthly('all')}
                  />
                  <MenuButton
                    text="This year"
                    className=""
                    onClick={() => this.onChangeMonthly('this_year')}
                  />
                  <MenuButton
                    text="This month"
                    className=""
                    onClick={() => this.onChangeMonthly('this_month')}
                  />
                  <MenuButton
                    text="This week"
                    className=""
                    onClick={() => this.onChangeMonthly('this_week')}
                  />
                </div>
              </div>
            }
          >
            <div className="flex ba b--light-silver br2 pointer dim">
              <h1 className="f6 fw6 ml2 grey ttc">
                {this.state.selectedMonth}
              </h1>
              <i className="material-icons grey mr2  md-21 mt2">
                keyboard_arrow_down
              </i>
            </div>
          </Tippy>
        </div>

        <div className="flex justify-between mt3">
          <React.Fragment>
            <div className="flex mr3" style={{ flex: ' 1 1 auto' }}>
              <i
                className="material-icons white bg-orange md-36 mt3 mb4 mr3"
                style={{ borderRadius: '50%' }}
              >
                error
              </i>
              <div>
                <h1 className="f5 fw6 grey">Employee At Risk</h1>
                <b className="f2 fw6 dark-grey">
                  {PeopleDashboardStore.overall_info_loaded
                    ? PeopleDashboardStore.overall_info.employee_at_risk
                    : null}
                </b>
              </div>
            </div>
            <div className="flex mr3" style={{ flex: ' 1 1 auto' }}>
              <i
                className="material-icons white bg-orange md-36 mt3 mb4 mr3"
                style={{ borderRadius: '50%' }}
              >
                access_time
              </i>
              <div>
                <h1 className="f5 fw6 grey">Tardiness Rate</h1>
                <b className="f2 fw6 dark-grey">
                  {PeopleDashboardStore.overall_info_loaded
                    ? `${PeopleDashboardStore.overall_info.tardiness_rate}%`
                    : null}
                </b>
              </div>
            </div>
            <div className="flex mr3" style={{ flex: ' 1 1 auto' }}>
              <i
                className="material-icons white bg-orange md-36 mt3 mb4 mr3"
                style={{ borderRadius: '50%' }}
              >
                clear
              </i>
              <div>
                <h1 className="f5 fw6 grey">Absent Rate</h1>
                <b className="f2 fw6 dark-grey">
                  {PeopleDashboardStore.overall_info_loaded
                    ? `${PeopleDashboardStore.overall_info.absent_rate}%`
                    : null}
                </b>
              </div>
            </div>
            <div className="flex" style={{ flex: ' 1 1 auto' }}>
              <i
                className="material-icons white bg-orange md-36 mt3 mb4 mr3"
                style={{ borderRadius: '50%' }}
              >
                autorenew
              </i>
              <div>
                <h1 className="f5 fw6 grey">Performance Rate</h1>
                <b className="f2 fw6 dark-grey">
                  {PeopleDashboardStore.overall_info_loaded
                    ? `${PeopleDashboardStore.overall_info.performance}%`
                    : null}
                </b>
              </div>
            </div>
          </React.Fragment>
        </div>
      </React.Fragment>
    )
  }
}
