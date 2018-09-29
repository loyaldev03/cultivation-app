import React from 'react'

import TaskList from './TaskList'

const WorkToDoToday = ({ todo, done, ...props }) => (
  <div {...props} >
    <div>
      <div>Work To Do Today</div>
      <div>
        <button>Report Issues</button>
        <button>Add Tasks</button>
      </div>
    </div>
    <div>
      <button>Ongoing Tasks</button>
      <button>Completed tasks</button>
    </div>

    <TaskList tasks={todo} />
  </div>
)

export default WorkToDoToday
