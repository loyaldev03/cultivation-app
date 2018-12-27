import { fadeToast, toast } from '../../../utils/toast'
import { httpOptions } from '../../../utils'
import TaskStore from '../stores/NewTaskStore'

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
          TaskStore.loadTasks(batch_id)
        }
      })
  } else {
    // Do nothing!
  }
}
