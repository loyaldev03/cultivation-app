import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import DashboardTaskStore from './DashboardTaskStore'

const TaskWidgetList = ({
  title,
  count,
  icon,
  className = '',
  loaded = true
}) => {
  return (
    <div
      className="flex items-center ba b--light-gray pa3 bg-white br2 mr1 mb1 "
      style={{ height: 150 + 'px', width: '50%' }}
    >
      <div className="flex" style={{ flex: ' 1 1 auto' }}>
        <i
          className={`material-icons white bg-orange md-48 ${className}`}
          style={{ borderRadius: '50%' }}
        >
          access_time
        </i>
        <div className="tc">
          <h1 className="f5 fw6 grey">{title}</h1>
          {loaded ? <b className="f2 fw6 dark-grey">{count}</b> : 'loading...'}
        </div>
      </div>
    </div>
  )
}

@observer
class TaskWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-between">
          <TaskWidgetList
            title="Unassigned task"
            count={
              DashboardTaskStore.data_task_dashboard.unassigned_tasks_count
            }
            className="ma3"
            loaded={DashboardTaskStore.task_dashboard_loaded}
          />
          <TaskWidgetList
            title="Tasks with issues"
            count={
              DashboardTaskStore.data_task_dashboard.tasks_with_issues_count
            }
            className="ma3"
            loaded={DashboardTaskStore.task_dashboard_loaded}
          />
          <TaskWidgetList
            title="Delayed tasks"
            count={
              DashboardTaskStore.data_task_dashboard.unscheduled_tasks_count
            }
            className="ma3"
            loaded={DashboardTaskStore.task_dashboard_loaded}
          />
          <TaskWidgetList
            title="Unscheduled tasks"
            count={DashboardTaskStore.data_task_dashboard.delayed_tasks_count}
            className="ma3"
            loaded={DashboardTaskStore.task_dashboard_loaded}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default TaskWidget
