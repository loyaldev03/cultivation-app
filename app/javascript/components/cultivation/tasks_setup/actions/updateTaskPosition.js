import { toast } from '../../../utils/toast'
import { httpPostOptions } from '../../../utils'

/*
 * OBSOLETE: Use update position in Task Store
 */
export default function updateTaskPosition(batchId, taskId, position) {
  const url = `/api/v1/batches/${batchId}/tasks/${taskId}/update_position`
  fetch(url, httpPostOptions({ task: { position } }))
    .then(response => response.json())
    .then(data => {
      if (data && data.data) {
        toast('Task Updated', 'success')
      } else {
        if (data.errors && data.errors.error) {
          toast(data.errors.error[0], 'error')
        } else {
          toast('Something happen', 'error')
        }
      }
    })
}
