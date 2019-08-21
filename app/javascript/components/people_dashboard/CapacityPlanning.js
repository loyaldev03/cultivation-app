import React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import Tippy from '@tippy.js/react'
import PeopleDashboardStore from './PeopleDashboardStore'
import { PeopleCapacityPlanningWidget } from '../utils'
import WorkerList from './WorkerList'

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

const PlanningCapacity = ({
  capacity,
  actual,
  height,
  job,
  color,
  onClick
}) => {
  return (
    <div
      className="mr2 grow dib"
      onClick={onClick}
      style={{ cursor: 'pointer', width: '70px' }}
    >
      <div className="tc" style={{ height: '120px', background: `${color}` }}>
        <div
          className="tc"
          style={{ height: `${height}%`, background: 'white', opacity: 0.5 }}
        >
          {height > 60.5 ? (
            <span className="f6 fw6 black ">
              {actual} / {capacity} Hours
            </span>
          ) : (
            ''
          )}
        </div>
        {height <= 60.5 ? (
          <span className="f6 fw6 white">
            {actual} / {capacity} Hours
          </span>
        ) : (
          ''
        )}
      </div>
      <div>
        <h1 className="f5 fw6 grey ttc tc">{job}</h1>
      </div>
    </div>
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
    this.setState({ selectedMonth: range.split('_').join(' ') })
    PeopleDashboardStore.loadCapacityPlanning(this.props.facility_id, range)
  }

  setWorkerList = e => {
    PeopleDashboardStore.setWorkerList(e)
  }

  render() {
    return (
      <React.Fragment>
        <div className="ba b--light-gray pa3 bg-white br2 mr3 w-100">
          <div className="flex justify-between mb4">
            <div>
              <h1 className="f5 fw6 dark-grey mb3">Capacity Planning</h1>
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
          {PeopleDashboardStore.capacity_planning_loaded ? (
            <div className="flex justify-between mb3">
              {PeopleDashboardStore.data_capacity_planning.map((e, i) => (
                <PlanningCapacity
                  key={i}
                  capacity={e.capacity}
                  actual={e.actual}
                  height={e.percentage + 0.5}
                  job={e.title}
                  color={e.color}
                  onClick={() => this.setWorkerList(e.title)}
                  onMouseOver={() => this.onMouseOver(e.percentage)}
                />
              ))}
            </div>
          ) : (
            'loading...'
          )}
          <div>
            {PeopleDashboardStore.current_workers_length > 0 ? (
              <WorkerList facility_id={this.props.facility_id} />
            ) : (
              ''
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}
