import React from 'react'
import HeaderRow from './HeaderRow'
import TaskRow from './TaskRow'
import { observer } from 'mobx-react'

const BatchedDailyTasks = observer(({ batchId, batchNo, batchName, tasks }) => {
  return (
    <div className="box--shadow bg-white pb3 mb4">
      <div className="flex pa3 items-center hide-child">
        <h3 className="h6--font dark-grey ma0 pa0">
          Batch {batchNo} - {batchName}
        </h3>
      </div>
      <HeaderRow />
      {tasks.map(x => (
        <TaskRow key={x.id} {...x} />
      ))}
    </div>
  )
})

export default BatchedDailyTasks
