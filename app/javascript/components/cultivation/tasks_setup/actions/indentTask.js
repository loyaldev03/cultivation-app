import TaskStore from '../stores/NewTaskStore'
import { fadeToast, toast } from '../../../utils/toast'

export default function indentTask(batch_id, row, action) {
  console.log(action)
  console.log(row)
  let id = row.id
  let url = `/api/v1/batches/${batch_id}/tasks/${id}/indent`
  fetch(url, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ task: { id: id, action: action } }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.data.id != null) {
        toast(`Task Indented ${action}`, 'success')

        TaskStore.loadTasks(batch_id)
      } else {
        toast('Something happen', 'error')
      }
    })
}
