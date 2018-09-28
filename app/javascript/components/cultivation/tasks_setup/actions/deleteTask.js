import { fadeToast, toast } from '../../../utils/toast'
import loadTasks from './loadTask'

export default function deleteTask(batch_id, row, action) {
  if (confirm('Are you sure you want to delete this task? ')) {
    let id = row.id
    let url = `/api/v1/batches/${batch_id}/tasks/${id}`
    fetch(url, {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify({ task: { id: id, action: action } }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.result === true) {
          toast('Task Deleted', 'success')

          loadTasks.loadbatch(batch_id)
        } else {
          toast('Something happen', 'error')
        }
      })
  } else {
    // Do nothing!
  }
}
