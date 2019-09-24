import React from 'react'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import Tippy from '@tippy.js/react'
import {
  MiniBoxWidget,
  Loading,
  numberFormatter,
  decimalFormatter
} from '../utils'

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
    ChartStore.cultivationInfo(this.props.facility_id, range)
  }

  render() {
    const {cost_permission} = this.props
    return (
      <React.Fragment>
        <div className="ba b--light-gray bg-white br2">
          <div className="ph4 pt3 flex justify-between">
            <div>
              <span className="f5 fw6 dark-grey">Overall Info</span>
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
                <i className="material-icons grey mr2 md-21 mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </Tippy>
          </div>

          <div className="ph4 pv3 mb2 flex justify-between bg-white">
            {ChartStore.cultivation_info_loaded ? (
              <React.Fragment>
                <MiniBoxWidget
                  icon="spa"
                  title="Total plants"
                  value={numberFormatter.format(
                    ChartStore.cultivation_info.total_plants
                  )}
                />
                <MiniBoxWidget
                  icon="amp_stories"
                  title="Total yield"
                  value={numberFormatter.format(
                    ChartStore.cultivation_info.total_yield
                  )}
                />
                <MiniBoxWidget
                  icon="amp_stories"
                  title="Projected yield"
                  value={decimalFormatter.format(
                    ChartStore.cultivation_info.facility_capacity
                  )}
                />
                {cost_permission && cost_permission == true ?
                  <MiniBoxWidget
                  icon="monetization_on"
                  title="Active batches cost to date"
                  value={`$ ${decimalFormatter.format(
                    ChartStore.cultivation_info.active_batches_cost
                  )}`} />
                : ''
              
                }
                
                <MiniBoxWidget
                  icon="home"
                  title="Facility capacity"
                  value={`${ChartStore.cultivation_info.facility_capacity}%`}
                />
              </React.Fragment>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}
