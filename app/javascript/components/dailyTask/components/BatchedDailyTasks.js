import React from 'react'
import HeaderRow from './HeaderRow'
import TaskRow from './TaskRow'
import { observer } from 'mobx-react'

const BatchedDailyTasks = observer(
  ({ batchId, batchNo, batchName, tasks, type }) => {
    return (
      <div className="box--shadow bg-white pb3 mb4">
        <div className="flex pa3 items-center hide-child">
          <h3 className="h6--font dark-grey ma0 pa0">
            {type === 'others' && 'Other tasks'}
            {type !== 'others' && `Batch ${batchNo} - ${batchName}`}
          </h3>
          {type !== 'others' && (
            <a href={`/cultivation/batches/${batchId}`} className="pa1">
              <i className="ph2 material-icons icon--medium grey child fl">
                assignment
              </i>
            </a>
          )}
        </div>
        <HeaderRow />
        {tasks.map(x => (
          <TaskRow key={x.id} {...x} />
        ))}
      </div>
    )
  }
)

export default BatchedDailyTasks
