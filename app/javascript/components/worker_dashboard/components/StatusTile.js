import React from 'react'
import DashboardCalendarApp from '../dashboardCalendar/DashboardCalendarApp'
import { WorkerDashboardGraph } from '../../utils'
import workerDashboardStore from '../stores/WorkerDashboardStore'
export default class StatusTile extends React.Component {
  state = {
    task: []
  }
  componentDidMount = async () => {
    let date = new Date()
    let task = await workerDashboardStore.getTaskByDate(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    )
    console.log(task)
    this.setState({ task })
  }
  render() {
    const { date } = this.props
    const { task } = this.state
    return (
      <div className="flex mt4">
        <div className="w-60">
          <div className="ba b--light-gray pa3 bg-white">
            <div className="flex justify-between">
              <div>
                <h1 className="f5 fw6 ml3">Working hours</h1>
              </div>
              <div className="flex">
                <h1 className="f5 fw6">Daily</h1>
                <i className="material-icons grey mr2 dim md-21 pointer mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </div>
            <img src={WorkerDashboardGraph} />
          </div>
          <div className="ba b--light-gray pa3 bg-white mt3">
            <div className="flex justify-between">
              <div>
                <h1 className="f5 fw6 ">Issues</h1>
              </div>
              <div className="flex">
                <h1 className="f5 fw6">Opened</h1>
                <i className="material-icons grey mr2 dim md-21 pointer mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </div>
            <ul className="list pl0 pb0">
              <li className="pt2 pb3 pointer">
                <div className="flex items-center justify-start">
                  <div className="f6 fw6 silver">ISSUE #00012</div>
                  <div className="f5 fw6 ph1">•</div>
                  <div className="f6 fw6 green pr2 ttu">open</div>
                  <div className="tc ttc">
                    <i
                      className="material-icons gold"
                      style={{ fontSize: '18px' }}
                    >
                      warning
                    </i>
                  </div>
                </div>
                <div className="flex pt1 justify-start">
                  <div className="fw4 gray" style={{ fontSize: '10px' }}>
                    Mar 06, 2019, 11:37 AM
                  </div>
                </div>
              </li>
              <li className="pt2 pb3 pointer">
                <div className="flex items-center justify-start">
                  <div className="f6 fw6 silver">ISSUE #00013</div>
                  <div className="f5 fw6 ph1">•</div>
                  <div className="f6 fw6 green pr2 ttu">open</div>
                  <div className="tc ttc">
                    <i
                      className="material-icons gold"
                      style={{ fontSize: '18px' }}
                    >
                      warning
                    </i>
                  </div>
                </div>
                <div className="flex pt1 justify-start">
                  <div className="fw4 gray" style={{ fontSize: '10px' }}>
                    Mar 06, 2019, 11:37 AM
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-40 ml3">
          <div className="ba b--light-gray pa3 bg-white">
            <div className="flex justify-between">
              <div>
                <h1 className="f5 fw6 ">Tasks</h1>
              </div>
              <div className="flex">
                <h1 className="f5 fw6">Today</h1>
                <i className="material-icons grey mr2 dim md-21 pointer mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </div>
            <div className="mt2">
              {task.slice(0, 2).map(x => {
                return (
                  <div className="flex justify-between mb2" key={x.id}>
                    <div className="grey">
                      <h1 className="f5 fw6">{x.attributes.name}</h1>
                      <b className="f6 fw4">
                        {x.attributes.location_name == ''
                          ? 'No Location'
                          : x.attributes.location_name}
                      </b>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center mt3">
              <a className="fw6 orange dim pointer" href="/daily_tasks">
                Show More
              </a>
            </div>
          </div>
          <div
            className="ba b--light-gray pa3 bg-white mt3"
            style={{ height: '435px' }}
          >
            <div className="flex justify-between">
              <div>
                <h1 className="f5 fw6 ">Working Calendar</h1>
              </div>
              <div className="flex">
                <h1 className="f5 fw6">Days off</h1>
                <i className="material-icons grey mr2 dim md-21 pointer mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </div>
            <div>
              <DashboardCalendarApp date={date} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
