import React from 'react'
import Tippy from '@tippy.js/react'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import { TempHomeTaskHighestCost } from '../utils'
import {
  decimalFormatter,
  numberFormatter
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
        {ChartStore.unassigned_task_loaded ? (
          <table>
            <tbody>
              <tr className="grey tl">
                <th>
                  <div className="mb2">Task Name</div>
                </th>
                <th>
                  <div className="mb2">Average Time (hrs)</div>
                </th>
                {cost_permission && cost_permission == true ? (
                  <th>
                    <div className="mb2">End Date</div>
                  </th>
                ) : (
                  ''
                )}
                
              </tr>
              {ChartStore.data_highest_cost_task.map((e, i) => (
                <React.Fragment >
                  {e.tasks.map(u => (
                    <tr className="grey mb3" key={u.id}>
                      <td className="w-50">
                        <div className="mb3">{u.name}</div>
                      </td>
                      <td className="f5">
                        <div className="mb3 tc">{decimalFormatter.format(u.sum_actual_hours)}</div>
                      </td>
                      {cost_permission && cost_permission == true ? (
                        <td className="f5">
                          <div className="mb3 tc">{decimalFormatter.format(u.actual_cost)}</div>
                        </td>
                      ) : (
                        ''
                      )}
                    </tr>
                  ))}
                  <tr className="pa2 dark-grey" key={i}>
                    <td>
                      <div className="b mb2 mt2">Total</div>
                    </td>
                    <td className="tc b">{decimalFormatter.format(e.total_sum_actual_hours)}</td>
                    {cost_permission && cost_permission == true ? (
                      <td className="tc b">{decimalFormatter.format(e.total_actual_cost)}</td>
                    ) : (
                      ''
                    )}
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
