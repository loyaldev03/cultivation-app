import React from 'react'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import moment from 'moment'

import { toggleTask } from '../actions/taskActions'
import DailyTasksStore from '../store/DailyTasksStore'
import EditPanel from './EditPanel'

const TaskRow = observer((props) => {
  const { dailyTask, index } = props
  const classes = 'pa2 tc'
  const task = dailyTask.attributes.task
  const timeSpentToday = moment().startOf('day').seconds(parseInt(dailyTask.attributes.duration)).format('H [hr] m [mn]')
  const taskIsStarted = dailyTask.attributes.status == 'started'
  const taskIsDone = dailyTask.attributes.status == 'done'

  const humanizeStatus = (status) => {
    switch(status) {
    case 'started':
      return 'Working On It'
    case 'stopped':
      return ''
    case 'done':
      return 'Done'
    case 'stuck':
      return 'Stuck :('
    default:
      return ''
    }
  }

  return (
    <React.Fragment>
      <div
        data-task-id={task.id}
        data-work-day-id={dailyTask.id}
        className={classes}>{index + 1}
      </div>
      <div className={classes}>+</div>
      <div onClick={() => { DailyTasksStore.editingPanel = (<EditPanel dailyTask={dailyTask} />)}} className={`pointer ${classes}`} style={{textAlign: 'left'}}>{task.attributes.name}</div>
      <div className={classes}>{task.attributes.start_date}</div>
      <div className={classes}>{task.attributes.end_date}</div>
      <div className={classes}>{timeSpentToday}</div>
      <div className={classes}>{!taskIsDone && <button onClick={() => toggleTask(dailyTask)}>{taskIsStarted ? 'End' : 'Start'}</button>}</div>
      <div className={classes}>{humanizeStatus(dailyTask.attributes.status)}</div>
    </React.Fragment>
  )
})

export default TaskRow