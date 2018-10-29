import React from 'react'
import { observer } from 'mobx-react'

import Batch from './Batch'
import DailyTasksStore from '../store/DailyTasksStore'

const BatchesList = observer(() => (
  <div className="flex flex-column">
    {DailyTasksStore.dailyTasksByBatch.map((taskBatch, i) => (
      <Batch item={taskBatch} key={i} />
    ))}
  </div>
))

export default BatchesList
