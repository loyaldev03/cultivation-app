import { fadeToast, toast } from '../../../utils/toast'
import { httpOptions } from '../../../utils'
import loadTasks from './loadTask'

export default function deleteTask(batch_id, row, action) {
  if (confirm('Are you sure you want to delete this task? ')) {
    let id = row.id
    let url = `/api/v1/batches/${batch_id}/tasks/${id}`
    fetch(url, httpOptions('DELETE', { task: { id: id, action: action } }))
      .then(response => response.json())
      .then(data => {
        if (data.errors && data.errors.id) {
          toast(data.errors.id, 'error')
        } else {
          toast('Task has been deleted', 'success')
          loadTasks.loadbatch(batch_id)
        }
      })
  } else {
    // Do nothing!
  }
}
