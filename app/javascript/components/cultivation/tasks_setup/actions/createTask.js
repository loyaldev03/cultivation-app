import TaskStore from '../stores/TaskStore'
import { fadeToast, toast } from '../../../utils/toast'
import loadTasks from './loadTask'

class createTask {
  createTask(state) {
    let task = {
      batch_id: state.batch_id,
      duration: state.duration,
      end_date: state.end_date.toDateString(),
      estimated_hours: state.estimated_hours,
      instruction: state.instruction,
      name: state.name,
      parent_id: state.parent_id,
      parent_task: state.parent_task,
      position: state.position,
      start_date: state.start_date.toDateString(),
      task_category: state.task_category,
      task_related_id: state.task_related_id
    }

    let url = `/api/v1/batches/${state.batch_id}/tasks`

    fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ task: task }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.data.id != null) {
          toast('Task Created', 'success')
          // let task = TaskStore.find(e => e.id === data.data.id);
          // console.log(data.data)
          // console.log(JSON.stringify(task))
          // console.log(JSON.stringify(task.attributes))

          // TaskStore.forEach((element, index) => {
          //   if (element.id === data.data.id) {
          //     TaskStore[index] = data.data;
          //   }
          // });
          loadTasks.loadbatch(state.batch_id)
          window.editorSidebar.close()
        } else {
          toast('Something happen', 'error')
        }
      })
  }
}

const task = new createTask()
export default task
