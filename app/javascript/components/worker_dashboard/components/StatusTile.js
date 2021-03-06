import React from 'react'
import DashboardCalendarApp from '../dashboardCalendar/DashboardCalendarApp'
import { ErrorBoundary, NoData } from '../../utils'
import workerDashboardStore from '../stores/WorkerDashboardStore'
import IssueList from '../../../components/dailyTask/components/IssueList'
import SidebarStore from '../../../components/dailyTask/stores/SidebarStore'
import Tippy from '@tippy.js/react'
import WorkingHourApp from './WorkingHourApp'
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

export default class StatusTile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      task: [],
      issue: [],
      selectedStatus: 'open',
      arr_ranges: [
        { val: 'daily', label: 'Daily' },
        { val: 'weekly', label: 'Weekly' }
      ]
    }
  }
  componentDidMount = async () => {
    let date = new Date()
    let task = await workerDashboardStore.getTaskByDate(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    )
    let issue = await workerDashboardStore.getIssue('open')
    this.setState({ task, issue })
  }

  onChangeStatus = async range => {
    let issuelist = []
    issuelist = await workerDashboardStore.getIssue(range)
    this.setState({ selectedStatus: range, issue: issuelist })
  }

  onShowIssue = issue => {
    let issueId = issue.id
    let mode = 'details'
    let dailyTask = true // What
    SidebarStore.openIssues(
      issueId,
      mode,
      dailyTask,
      issue.task_id,
      issue.batch_id
    )
    event.preventDefault()
  }

  render() {
    const { date } = this.props
    let { task, issue, arr_ranges } = this.state
    // issue = issue.map(x => x.tasks.map(i => i.attributes.issues))
    return (
      <div className="flex mt4">
        <div className="w-60">
          <div
            className="ba b--light-gray pa3 bg-white mt3"
            style={{ minHeight: 330 + 'px' }}
          >
            <WorkingHourApp arr_ranges={arr_ranges} />
          </div>
          <div className="ba b--light-gray pa3 bg-white mt3">
            <div className="flex justify-between">
              <div>
                <h1 className="f5 fw6 dark-grey mb3">Issues</h1>
              </div>
              <Tippy
                placement="bottom-end"
                trigger="click"
                duration="0"
                content={
                  <div className="bg-white f6 flex">
                    <div className="db shadow-4">
                      <MenuButton
                        text="Open"
                        className=""
                        onClick={() => this.onChangeStatus('open')}
                      />
                      <MenuButton
                        text="Resolved"
                        className=""
                        onClick={() => this.onChangeStatus('resolved')}
                      />
                    </div>
                  </div>
                }
              >
                <div className="flex ba b--light-silver br2 pointer dim">
                  <h1 className="f6 fw6 ml2 grey ttc">
                    {this.state.selectedStatus}
                  </h1>
                  <i className="material-icons grey mr2  md-21 mt2">
                    keyboard_arrow_down
                  </i>
                </div>
              </Tippy>
            </div>

            <div className="overflow-y-scroll" style={{ height: 330 + 'px' }}>
              <IssueList
                cn1="mr2"
                cn2="mr3"
                show={true}
                issues={issue}
                onShow={this.onShowIssue}
                onDelete={this.onToggleAddIssue}
              />

              {issue && !isEmpty(issue) ? (
                <div className="flex justify-center mv3">
                  <a className="fw6 orange dim pointer" href="/daily_tasks">
                    Show More
                  </a>
                </div>
              ) : (
                <NoData text="No issues found" />
              )}
            </div>
          </div>
        </div>
        <ErrorBoundary>
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
                {!isEmpty(task) &&
                  task.slice(0, 2).map(x => {
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
              {!isEmpty(task) && task.length > 0 ? (
                <div className="flex justify-center mv3">
                  <a className="fw6 orange dim pointer" href="/daily_tasks">
                    Show More
                  </a>
                </div>
              ) : (
                <NoData text="No tasks for today" />
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
        </ErrorBoundary>
      </div>
    )
  }
}
