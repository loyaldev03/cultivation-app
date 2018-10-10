import { fadeToast, toast } from '../../../utils/toast'
import loadTasks from './loadTask'

export default function deleteMaterial(task_id, id) {
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

          // loadTasks.loadbatch(batch_id)
        } else {
          toast('Something happen', 'error')
        }
      })
  } else {
    // Do nothing!
  }
}
