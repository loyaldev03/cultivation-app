import { toast } from '../../../utils/toast'
import loadTasks from './loadTask'
import { httpPostOptions } from '../../../utils'

export default function updateTaskPosition(batch_id, task, position) {
  const url = `/api/v1/batches/${batch_id}/tasks/${task.id}/update_position`
  fetch(url, httpPostOptions({ task: { position } }))
    .then(response => response.json())
    .then(data => {
      if (data && data.data) {
        toast('Task Updated', 'success')
        loadTasks.loadbatch(batch_id)
      } else {
        if (data.errors && data.errors.error) {
          toast(data.errors.error[0], 'error')
        } else {
          toast('Something happen', 'error')
        }
      }
    })
}
