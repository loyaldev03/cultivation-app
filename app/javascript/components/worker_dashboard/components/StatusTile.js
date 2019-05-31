import React from 'react'
import DashboardCalendarApp from '../dashboardCalendar/DashboardCalendarApp'
import { WorkerDashboardGraph, longDate } from '../../utils'
import workerDashboardStore from '../stores/WorkerDashboardStore'
import { formatIssueNo } from '../../issues/components/FormatHelper'
export default class StatusTile extends React.Component {
  state = {
    task: [],
    issue: []
  }
  componentDidMount = async () => {
    let date = new Date()
    let task = await workerDashboardStore.getTaskByDate(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    )
    let issue = await workerDashboardStore.getTask()
    this.setState({ task, issue })
  }
  render() {
    const { date } = this.props
    let { task, issue } = this.state
    issue = issue.map(x => x.tasks.map(i => i.attributes.issues))
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
              {issue &&
                issue.slice(0, 2).map(x =>
                  x.slice(0, 2).map(i =>
                    i.slice(0, 2).map(k => (
                      <li className="pt2 pb3 pointer" key={k}>
                        <div className="flex items-center justify-start">
                          <div className="f6 fw6 silver">
                            ISSUE {formatIssueNo(k.issue_no)}
                          </div>
                          <div className="f5 fw6 ph1">•</div>
                          <div
                            className={`f6 fw6 ${
                              k.status === 'open' ? 'green' : 'gray'
                            } pr2 ttu`}
                          >
                            {k.status}
                          </div>
                          {k.severity === 'high' && (
                            <div className="tc ttc">
                              <i
                                className="material-icons red"
                                style={{ fontSize: '18px' }}
                              >
                                error
                              </i>
                            </div>
                          )}
                          {k.severity === 'medium' && (
                            <div className="tc ttc">
                              <i
                                className="material-icons gold"
                                style={{ fontSize: '18px' }}
                              >
                                warning
                              </i>
                            </div>
                          )}
                          {k.severity === 'low' && (
                            <div class="tc ttc purple f7">FYI</div>
                          )}
                        </div>
                        <div className="flex pt1 justify-start">
                          <div
                            className="fw4 gray"
                            style={{ fontSize: '10px' }}
                          >
                            {longDate(new Date(k.created_at))}
                          </div>
                        </div>
                      </li>
                    ))
                  )
                )}
            </ul>
            {issue && issue.length > 0 ? (
              <div className="flex justify-center mv3">
                <a className="fw6 orange dim pointer" href="/daily_tasks">
                  Show More
                </a>
              </div>
            ) : (
              <div className="flex justify-center mv5">
                <span className="fw6 gray dim">No isssue for today</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-40 ml3">
          <div className="ba b--light-gray pa3 bg-white h5">
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
            {task.length > 0 ? (
              <div className="flex justify-center mv3">
                <a className="fw6 orange dim pointer" href="/daily_tasks">
                  Show More
                </a>
              </div>
            ) : (
              <div className="flex justify-center mt5">
                <span className="fw6 gray dim">No task for today</span>
              </div>
            )}
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
