import React from 'react'
import { toJS } from 'mobx'
import HeaderRow from './HeaderRow'
import TaskRow from './TaskRow'
import { observer } from 'mobx-react'

const BatchedDailyTasks = observer(
  ({ batchId, batchNo, batchName, tasks, onToggleAddIssue }) => {
    return (
      <div className="box--shadow bg-white pb3 mb4">
        <div className="ph3 pb3 pt4">
          <h3 className="h6--font dark-grey ma0 pa0">
            Batch {batchNo} - {batchName}
          </h3>
        </div>
        <HeaderRow />
        {tasks.map(x => {
          // console.log(toJS(x))
          return (
            <TaskRow key={x.id} {...x} />
          )
        })}
      </div>
    )
  }
)

export default BatchedDailyTasks
