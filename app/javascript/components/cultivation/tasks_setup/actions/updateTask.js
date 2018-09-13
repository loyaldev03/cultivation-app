import TaskStore from '../stores/TaskStore'
import { fadeToast, toast } from '../../../utils/toast'
import loadTasks from './loadTask'

class updateTask {

  updateTask(state) {
    let id = state.id['$oid']
    let url = `/api/v1/batches/${state.batch_id['$oid']}/tasks/${id}`
    fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({ task: state }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.data)
        if (data.data.id != null) {
          toast('Task Updated', 'success')
          let task = TaskStore.find(e => e.id === data.data.id);
          console.log(data.data)
          console.log(JSON.stringify(task))
          console.log(JSON.stringify(task.attributes))

          TaskStore.forEach((element, index) => {
            if (element.id === data.data.id) {
              TaskStore[index] = data.data;
            }
          });

          loadTasks.loadbatch(state.batch_id)
          window.editorSidebar.close()

        }
        else { toast('Something happen', 'error') }
      })


  }

  updatePosition(a, b) {
    if(a !== null && b !== null){
      TaskStore.splice(a, 0, TaskStore.splice(b, 1)[0]);
    }
    // console.log(TaskStore[a].attributes.name)
    // console.log(TaskStore.splice(b, 1)[0].attributes.name)
  }
}

const task = new updateTask()
export default task
