import SidebarTaskStore from '../stores/SidebarTaskStore'

class updateSidebarTask {

  update(id) {
    SidebarTaskStore.name = id
  }
}

const task = new updateSidebarTask()
export default task
