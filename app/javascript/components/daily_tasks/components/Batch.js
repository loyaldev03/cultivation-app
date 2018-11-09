import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import { safeDisplay } from '../../utils/StringHelper'
import TasksList from './TasksList'

const Batch = observer(props => {
  const { batch, tasks } = props.item

  return (
    <React.Fragment>
      <div className="flex">
        <div className="w-70 mb2">
          <h2 className="f4 mb2" data-batch-id={batch.id}>
            {safeDisplay(batch.attributes.name)}
          </h2>
          <div className="f7 mb2">{safeDisplay(batch.rooms.join(', '))}</div>
        </div>
        <div className="w-30 tr mt4">
          <div className="di ph4 pv2 b--black-10 ba">
            {batch.attributes.current_phase}
          </div>
          <div className="di relative ph4 pv2 ml2 b--black-10 ba">
            <FloatingLabel className="absolute black-40 bg-white tc">
              Days
            </FloatingLabel>
            {batch.attributes.progress_today}/{
              batch.attributes.estimated_total_days
            }
          </div>
        </div>
      </div>
      <TasksList tasks={tasks} />
    </React.Fragment>
  )
})

const FloatingLabel = styled.div`
  top: -8px;
  left: 50%;
  width: 50px;
  margin-left: -25px;
  font-size: 0.8rem;
`

export default Batch
