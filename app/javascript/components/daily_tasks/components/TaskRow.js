import React from 'react'
import { observer } from 'mobx-react'
import { format, startOfDay, addSeconds } from 'date-fns'
import styled from 'styled-components'

import { toggleTask } from '../actions/taskActions'
import DailyTasksStore from '../store/DailyTasksStore'
import EditPanel from './EditPanel'

const TaskRow = observer(props => {
  const { dailyTask, index } = props
  const classes = 'pa2 tc black-60 lh-copy bb b--black-10'
  const task = dailyTask.attributes.task
  const timeSpentToday = (() => {
    let temp = startOfDay(new Date())
    temp = addSeconds(temp, parseInt(dailyTask.attributes.duration))
    return format(temp, "H [hr] m [mn]")
  })()

  const taskIsStarted = dailyTask.attributes.status == 'started'
  const taskIsDone = dailyTask.attributes.status == 'done'

  const humanizeStatus = status => {
    switch (status) {
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
        className={classes}
      >
        {index + 1}
      </div>
      <div className={classes}>+</div>
      <div
        onClick={() => {
          DailyTasksStore.editingPanel = <EditPanel dailyTask={dailyTask} />
        }}
        className={`pointer ${classes}`}
        style={{ textAlign: 'left' }}
      >
        {task.attributes.name}
      </div>
      <div className={classes}>{format(task.attributes.start_date, 'M/d/YYYY')}</div>
      <div className={classes}>{format(task.attributes.end_date, 'M/d/YYYY')}</div>
      <div className={classes}>{timeSpentToday}</div>
      <StartEnd
        className={`${classes} pointer white`}
        taskIsStarted={taskIsStarted}
        onClick={() => toggleTask(dailyTask)}
      >
        {!taskIsDone && taskIsStarted ? 'End' : 'Start'}
      </StartEnd>
      <Status
        className={`${classes} pointer white`}
        status={dailyTask.attributes.status}
      >
        {humanizeStatus(dailyTask.attributes.status)}
      </Status>
    </React.Fragment>
  )
})

const StartEnd = styled.div`
  background-color: ${props => (props.taskIsStarted ? '#e67041' : '#62c1b4')}
  outline: 1px solid white;
`

const Status = styled.div`
  background-color: ${props => {
    switch (props.status) {
    case 'started':
      return '#f6cc45'
    case 'stuck':
      return '#d4483e'
    default:
      return '#d8d8d8'
    }
  }}
  outline: 1px solid white;
`

export default TaskRow
