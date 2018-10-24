import DisplayTaskStore from '../stores/DisplayTaskStore'
import TaskStore from '../stores/TaskStore'

export default function loadDisplayTaskStore() {
  let filteredTask = TaskStore.slice()
    .map(e => e.id)
  DisplayTaskStore.replace(filteredTask)
}
