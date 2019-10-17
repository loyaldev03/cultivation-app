import React from 'react'
import Tippy from '@tippy.js/react'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import { TempHomeTaskHighestCost } from '../utils'
import { decimalFormatter, Loading, NoData } from '../utils'
import isEmpty from 'lodash.isempty'

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

const DataList = ({
  idx,
  name,
  actual_hours,
  actual_labor_cost,
  cost_permission
}) => {
  return (
    <div className="flex grey tl f5 mb3" key={idx}>
      <div className="fl w-50">{name}</div>
      <div className="fl tc w-25">{decimalFormatter.format(actual_hours)}</div>
      {cost_permission && cost_permission == true ? (
        <div className="fl tc w-25">
          {decimalFormatter.format(actual_labor_cost)}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
@observer
export default class HighestCostTaskList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedMonth: 'All'
    }
  }

  onChangeMonthly = range => {
    this.setState({ selectedMonth: range.split('_').join(' ') })
    ChartStore.highestCostTask(range, this.props.facility_id)
  }

  render() {
    const { cost_permission } = this.props
    return (
      <React.Fragment>
        <div className="flex justify-between mb4">
          <h1 className="f5 fw6 dark-grey">
            Task with Highest Costs In Time{' '}
            {cost_permission && cost_permission == true ? 'and $ Value' : ''}
          </h1>

          <Tippy
            placement="bottom-end"
            trigger="click"
            duration="0"
            content={
              <div className="bg-white f6 flex">
                <div className="db shadow-4">
                  <MenuButton
                    key="highestcostAll"
                    text="All"
                    className=""
                    onClick={() => this.onChangeMonthly('all')}
                  />
                  <MenuButton
                    key="highestcostYear"
                    text="This year"
                    className=""
                    onClick={() => this.onChangeMonthly('this_year')}
                  />
                  <MenuButton
                    key="highestcostMonth"
                    text="This month"
                    className=""
                    onClick={() => this.onChangeMonthly('this_month')}
                  />
                  <MenuButton
                    key="highestcostWeek"
                    text="This week"
                    className=""
                    onClick={() => this.onChangeMonthly('this_week')}
                  />
                </div>
              </div>
            }
          >
            <div className="flex ba b--light-silver br2 pointer dim">
              <h1 className=" ttc f6 fw6 ml2 grey">
                {this.state.selectedMonth}
              </h1>
              <i className="material-icons grey mr2  md-21 mt2">
                keyboard_arrow_down
              </i>
            </div>
          </Tippy>
        </div>
        {ChartStore.unassigned_task_loaded ? (
          !isEmpty(ChartStore.data_highest_cost_task.tasks) ? (
            <React.Fragment>
              <div className="flex grey b tl mb2">
                <div className="fl w-50">Task Name</div>
                <div className="fl w-25 tc">Average Time (hrs)</div>
                {cost_permission && cost_permission == true ? (
                  <div className="fl w-25 tc">Average Time ($)</div>
                ) : (
                  ''
                )}
              </div>
              {ChartStore.data_highest_cost_task.tasks.map((e, y) => (
                <DataList
                  key={y}
                  idx={y}
                  name={e.name}
                  actual_hours={e.actual_hours}
                  actual_labor_cost={e.actual_labor_cost}
                  cost_permission={cost_permission}
                />
              ))}
              <div className="flex b dark-grey mt4 mb3">
                <div className="fl w-50 ">total</div>
                <div className="fl w-25 tc">
                  {decimalFormatter.format(
                    ChartStore.data_highest_cost_task.total_sum_actual_hours
                  )}
                </div>
                {cost_permission && cost_permission == true ? (
                  <div className="fl w-25 tc">
                    {decimalFormatter.format(
                      ChartStore.data_highest_cost_task.total_actual_cost
                    )}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </React.Fragment>
          ) : (
            <NoData />
          )
        ) : (
          <Loading />
        )}
      </React.Fragment>
    )
  }
}
