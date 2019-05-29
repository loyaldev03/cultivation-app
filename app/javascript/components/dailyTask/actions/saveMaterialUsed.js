import dailyTasksStore from '../stores/DailyTasksStore'
import materialUsedStore from '../stores/MaterialUsedStore'
import { toJS } from 'mobx'
import { httpPostOptions } from '../../utils/FetchHelper'

const saveMaterialUsed = (batchId, taskId, materialUsedId, actual, waste) => {
  // update API
  // update store
  console.log(batchId, taskId, materialUsedId, actual, waste)

  if (batchId === 'others') {
    const batch = toJS(dailyTasksStore.otherTasks)
    const task = batch.tasks.find(x => x.id === taskId)
    const materialUsed = task.items.find(x => x.id === materialUsedId)
    materialUsed.actual = actual
    materialUsed.waste = waste

  } else {
    const batches = toJS(dailyTasksStore.batches)
    const index = batches.findIndex(x => x.id == batchId)
    const batch = batches[index]

    const task = batch.tasks.find(x => x.id === taskId)
    const materialUsed = task.items.find(x => x.id === materialUsedId)
    materialUsed.actual = actual
    materialUsed.waste = waste
  }

  const payload = {
    date: new Date().toISOString(),
    materialUsedId,
    actual,
    waste
  }

  fetch(
    `/api/v1/daily_tasks/${taskId}/save_material_used`,
    httpPostOptions(payload)
  )
    .then(x => x.json())
    .then(data => {
      console.log(data)
      materialUsedStore.update(data.key, data)
      // const newBatches = [...batches.slice(0, index - 1), batch, ...batches.slice(index + 1)]
      // dailyTasksStore.load(batches)
    })
  // .catch(d => console.log(d))
}

export default saveMaterialUsed
