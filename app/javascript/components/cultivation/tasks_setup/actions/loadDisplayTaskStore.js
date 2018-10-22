import DisplayTaskStore from '../stores/DisplayTaskStore'
import TaskStore from '../stores/TaskStore'

export default function loadDisplayTaskStore() {
  let filteredTask = TaskStore.slice()
    .filter(e => e.attributes.is_phase === true)
    .map(e => e.id)
  DisplayTaskStore.replace(filteredTask)
}
