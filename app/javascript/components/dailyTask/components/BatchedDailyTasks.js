import React from 'react'
import HeaderRow from './HeaderRow'
import TaskRow from './TaskRow'
import { observer } from 'mobx-react'

const BatchedDailyTasks = observer(
  ({
    batchId,
    batchNo,
    batchName,
    tasks,
    onToggleAddIssue,
    onToggleAddNotes
  }) => {
    return (
      <div className="box--shadow bg-white pb3 mb4">
        <div className="ph3 pb3 pt4">
          <h3 className="h6--font dark-grey ma0 pa0">
            Batch {batchNo} - {batchName}
          </h3>
        </div>
        <HeaderRow />
        {tasks.map(x => {
          console.log(`batchId: ${batchId}`)
          return (
            <TaskRow
              key={x.id}
              batchId={batchId}
              {...x}
              onToggleAddIssue={onToggleAddIssue}
              onToggleAddNotes={onToggleAddNotes}
            />
          )
        })}
      </div>
    )
  }
)

export default BatchedDailyTasks
