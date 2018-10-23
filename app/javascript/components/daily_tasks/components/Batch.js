import React from 'react'
import { observer } from 'mobx-react'

import { safeDisplay } from '../../utils/StringHelper'
import TasksList from './TasksList'

const Batch = observer((props) => {
  const { batch, tasks } = props.item
  return (
    <React.Fragment>
      <h2 className="f5" data-batch-id={batch.id}>{safeDisplay(batch.attributes.name)}</h2>
      <div className="f7 mb2">{safeDisplay(batch.rooms.join(', '))}</div>
      <TasksList tasks={tasks} />
    </React.Fragment>
  )
})

export default Batch
