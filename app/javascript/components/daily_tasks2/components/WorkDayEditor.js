import React from 'react'
import { observer } from 'mobx-react'

import DailyTasksStore from '../store/DailyTasksStore'

const SelectedTask = observer(props => {
  const item = DailyTasksStore.selectedTask
  const task = item.attributes.task

  return (
    <div {...props}>
      <div className="flex">
        <TaskInfo className="w-75 mb3">
          <TaskName>{task.attributes.name}</TaskName>
          <Instruction>{task.attributes.instruction}</Instruction>
        </TaskInfo>
      </div>

      <hr />

      <button>Mark this as done</button>
    </div>
  )
})

const TaskInfo = props => <div {...props}>{props.children}</div>
const TaskName = props => <div {...props}>{props.children}</div>
const Instruction = props => <div>{props.children}</div>

export default SelectedTask
