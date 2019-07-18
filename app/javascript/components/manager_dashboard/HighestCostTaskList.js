import React from 'react'
import Tippy from '@tippy.js/react'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import { TempHomeTaskHighestCost } from '../utils'

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
export default class HighestCostTaskList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedMonth: 'All'
    }
  }

  onChangeMonthly = range => {
    this.setState({ selectedMonth: range.split('_').join(' ') })
    ChartStore.highestCostTask(range)
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-between mb4">
          <h1 className="f5 fw6">
            Task with Highest Costs In Time and $ Value
          </h1>

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
              <h1 className=" ttc f6 fw6 ml2 grey">
                {this.state.selectedMonth}
              </h1>
              <i className="material-icons grey mr2  md-21 mt2">
                keyboard_arrow_down
              </i>
            </div>
          </Tippy>
        </div>
        {ChartStore.highest_cost_task_loaded ? (
          <table className="w-100">
            <thead>
              <tr className="tl mb2">
                <th className="w-40">Tasks</th>
                <th className="tc">Average Time (hrs)</th>
                <th className="tc">Average Cost</th>
              </tr>
            </thead>
            <tbody>
              {ChartStore.data_highest_cost_task.map(e => (
                <React.Fragment>
                  {e.tasks.map(u => (
                    <tr className="pa2">
                      <td>
                        <div className="mb2 mt2">{u.name}</div>
                      </td>
                      <td className="tc">{u.sum_actual_hours}</td>
                      <td className="tc">{u.actual_cost}</td>
                    </tr>
                  ))}
                  <tr className="pa2">
                    <td>
                      <div className="b mb2 mt2">Total</div>
                    </td>
                    <td className="tc b">{e.total_sum_actual_hours}</td>
                    <td className="tc b">{e.total_actual_cost}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          'loading...'
        )}
        
      </React.Fragment>
    )
  }
}
