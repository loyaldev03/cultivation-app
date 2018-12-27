import { fadeToast, toast } from '../../../utils/toast'
import TaskStore from '../stores/NewTaskStore'

export default function deleteMaterial(batch_id, task_id, id) {
  if (confirm('Are you sure you want to delete this material? ')) {
    let url = `/api/v1/items/${id}?task_id=${task_id}`
    fetch(url, {
      method: 'DELETE',
      credentials: 'include',
      // body: JSON.stringify({ material: { id: id, action: action } }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.result === true) {
          toast('Material Deleted', 'success')

          TaskStore.loadTasks(batch_id)
        } else {
          toast('Something happen', 'error')
        }
      })
  } else {
    // Do nothing!
  }
}
