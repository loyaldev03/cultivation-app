import TaskStore from '../stores/TaskStore'
import { fadeToast, toast } from '../../../utils/toast'
import loadTasks from './loadTask'

class createTask {
  createTask(state) {
    console.log(state)
    let url = `/api/v1/batches/${state.batch_id['$oid']}/tasks`
    fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ task: state }),
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
