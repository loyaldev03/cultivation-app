import React from 'react'
import Task from './Task'

const TaskList = ({ tasks }) => (
  <React.Fragment>
    {tasks.map((task, i) => (<Task task={task} key={i} />))}
  </React.Fragment>
)

export default TaskList
