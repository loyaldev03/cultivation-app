import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import DashboardTaskStore from './DashboardTaskStore'
import { numberFormatter, Loading } from '../../../utils'

const TaskWidgetList = ({ title, count, className = '', loaded = false }) => {
  return (
    <div className="flex flex-auto justify-center items-center ba b--light-gray pa3 bg-white br2 mr1 h4">
      <i
        className={`material-icons icon--large icon--rounded ba orange ${className} pa2 mr3`}
      >
        assignment
      </i>
      <div className="tc">
        <h1 className="f5 fw6 grey">{title}</h1>
        {loaded ? (
          <b className="f2 fw6 dark-grey">{numberFormatter.format(count)}</b>
        ) : (
          <Loading />
        )}
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
            loaded={DashboardTaskStore.task_dashboard_loaded}
          />
          <TaskWidgetList
            title="Tasks with issues"
            count={
              DashboardTaskStore.data_task_dashboard.tasks_with_issues_count
            }
            loaded={DashboardTaskStore.task_dashboard_loaded}
          />
          <TaskWidgetList
            title="Delayed tasks"
            count={
              DashboardTaskStore.data_task_dashboard.unscheduled_tasks_count
            }
            loaded={DashboardTaskStore.task_dashboard_loaded}
          />
          <TaskWidgetList
            title="Unscheduled tasks"
            count={DashboardTaskStore.data_task_dashboard.delayed_tasks_count}
            loaded={DashboardTaskStore.task_dashboard_loaded}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default TaskWidget
