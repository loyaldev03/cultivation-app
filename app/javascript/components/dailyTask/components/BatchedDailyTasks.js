import React from 'react'
import HeaderRow from './HeaderRow'
import TaskRow from './TaskRow'

const BatchedDailyTasks = ({
  batchNo,
  batchName,
  tasks,
  onToggleAddIssue,
  onToggleAddMaterial,
  onToggleAddNotes
}) => {
  return (
    <div className="box--shadow bg-white pb3 mb4">
      <div className="ph3 pb3 pt4">
        <h3 className="f3 grey ma0 pa0 fw4">Batch {batchNo} - {batchName}</h3>
      </div>
      <HeaderRow />
      {tasks.map(x => (
        <TaskRow
          key={x.id}
          {...x}
          onToggleAddIssue={onToggleAddIssue}
          onToggleAddMaterial={onToggleAddMaterial}
          onToggleAddNotes={onToggleAddNotes}
        />
      ))}
    </div>
  )
}

export default BatchedDailyTasks
