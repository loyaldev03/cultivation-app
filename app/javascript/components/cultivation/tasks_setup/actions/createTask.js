import { fadeToast, toast } from '../../../utils/toast'
import TaskStore from '../stores/NewTaskStore'
import { httpPostOptions } from '../../../utils'

class createTask {
  createTask(state) {
    let task = {
      batch_id: state.batch_id,
      action: state.action,
      duration: state.duration,
      end_date: state.end_date,
      estimated_hours: state.estimated_hours,
      name: state.name,
      start_date: state.start_date,
      task_related_id: state.task_related_id
    }

    let url = `/api/v1/batches/${state.batch_id}/tasks`

    fetch(url, httpPostOptions({ task }))
      .then(response => response.json())
      .then(data => {
        if (data.data.id != null) {
          toast('Task Created', 'success')
          TaskStore.loadTasks(state.batch_id)
          window.editorSidebar.close()
        } else {
          toast('Something happen', 'error')
        }
      })
  }
}

const task = new createTask()
export default task
