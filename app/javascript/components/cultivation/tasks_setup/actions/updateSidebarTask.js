import TaskStore from '../stores/TaskStore'

class updateSidebarTask {
  update(row) {
    let a = TaskStore.find(e => e.id === row['id'])
  }
}

const task = new updateSidebarTask()
export default task
