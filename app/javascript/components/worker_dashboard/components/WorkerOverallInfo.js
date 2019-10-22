import React from 'react'
import workerDashboardStore from '../stores/WorkerDashboardStore'
import { observer } from 'mobx-react'
import Tippy from '@tippy.js/react'
import {
  MiniBoxWidget,
  Loading,
  numberFormatter,
  decimalFormatter
} from '../../utils'

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
      selectedRange: this.props.arr_ranges[0],
      arr_ranges: this.props.arr_ranges
    }

    workerDashboardStore.loadWorkerOverallInfo(this.props.arr_ranges[0].val)
  }

  onChangeRange = range => {
    this.setState({ selectedRange: range })
    workerDashboardStore.loadWorkerOverallInfo(range.val)
  }

  render() {
    const { arr_ranges } = this.props
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
                    {arr_ranges.map((e, i) => (
                      <MenuButton
                        key={i}
                        text={e.label}
                        className=""
                        onClick={() => this.onChangeRange(e)}
                      />
                    ))}
                  </div>
                </div>
              }
            >
              <div className="flex ba b--light-silver br2 pointer dim">
                <h1 className="f6 fw6 ml2 grey">
                  {this.state.selectedRange.label}
                </h1>
                <i className="material-icons grey mr2  md-21 mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </Tippy>
          </div>

          <div className="ph4 pv3 mb2 flex justify-between bg-white">
            {workerDashboardStore.worker_info_loaded ? (
              <React.Fragment>
                <MiniBoxWidget
                  icon="check_circle"
                  title="Worked hours"
                  value={numberFormatter.format(
                    workerDashboardStore.data_overall_info.work_hours
                  )}
                />
                <MiniBoxWidget
                  icon="location_on"
                  title="On Time Arrivals"
                  value={numberFormatter.format(
                    workerDashboardStore.data_overall_info.on_time_arrivals
                  )}
                />
                <MiniBoxWidget
                  icon="assignment"
                  title="Tasks Completed"
                  value={decimalFormatter.format(
                    workerDashboardStore.data_overall_info.tasks_done
                  )}
                />

                <MiniBoxWidget
                  icon="assignment_turned_in"
                  title="Tasks Completed On Time"
                  value={decimalFormatter.format(
                    workerDashboardStore.data_overall_info
                      .completed_task_on_time
                  )}
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
