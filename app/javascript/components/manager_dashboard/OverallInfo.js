import React from 'react'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import Tippy from '@tippy.js/react'

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
    this.setState({ selectedMonth: range.split('_').join(' ') })
    console.log(this.props.facility_id)
    ChartStore.cultivationInfo(this.props.facility_id, range)
  }

  render() {
    return (
      <React.Fragment>
        <div className="ba b--light-gray pa3 bg-white br2">
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
                <h1 className="f6 fw6 ml2 grey">{this.state.selectedMonth}</h1>
                <i className="material-icons grey mr2  md-21 mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </Tippy>
          </div>

          <div className="flex justify-between mt2">
            <div className="flex" style={{ flex: ' 1 1 auto' }}>
              <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                check_circle
              </i>
              <div>
                <h1 className="f5 fw6 grey">Total plants</h1>
                <b className="f2 fw6 dark-grey">
                  {ChartStore.cultivation_info.total_plants}
                </b>
              </div>
            </div>

            {ChartStore.cultivation_info_loaded ? (
              <React.Fragment>
                <div className="flex" style={{ flex: ' 1 1 auto' }}>
                  <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                    location_on
                  </i>
                  <div>
                    <h1 className="f5 fw6 grey">Total yield</h1>
                    <b className="f2 fw6 dark-grey">
                      {ChartStore.cultivation_info.total_yield}
                    </b>
                  </div>
                </div>
                <div className="flex" style={{ flex: ' 1 1 auto' }}>
                  <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                    assignment
                  </i>
                  <div>
                    <h1 className="f5 fw6 grey">Projected yield</h1>
                    <b className="f2 fw6 dark-grey">
                      {ChartStore.cultivation_info.facility_capacity}
                    </b>
                  </div>
                </div>
                <div className="flex" style={{ flex: ' 1 1 auto' }}>
                  <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                    assignment_turned_in
                  </i>
                  <div>
                    <h1 className="f5 fw6 grey">Active batches cost to date</h1>
                    <b className="f2 fw6 dark-grey">{`$ ${
                      ChartStore.cultivation_info.active_batches_cost
                    }`}</b>
                  </div>
                </div>
                <div className="flex" style={{ flex: ' 1 1 auto' }}>
                  <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                    home
                  </i>
                  <div>
                    <h1 className="f5 fw6 grey">Facility capacity</h1>
                    <b className="f2 fw6 dark-grey">{`${
                      ChartStore.cultivation_info.facility_capacity
                    }%`}</b>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              'loading...'
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}
