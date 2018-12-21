import { observable, action, runInAction, toJS } from 'mobx'
import loadTask from '../actions/loadTask'
import {
  formatDate2,
  httpGetOptions,
  addDayToDate,
  toast
} from '../../../utils'

class TaskStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable tasks

  @action
  async loadTasks(batch_id) {
    const url = `/api/v1/batches/${batch_id}/tasks`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      console.log('>> load tasks from NewTaskListStore')
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  getFilteredTask(tasks) {
    tasks = toJS(tasks)
    if (this.isLoaded) {
      // console.log(tasks.filter(u => !this.hidden_ids.includes(u.id)))
      return tasks.filter(u => !this.hidden_ids.includes(u.id))
    } else {
      return []
    }
  }

  getGanttTasks() {
    return toJS(this.formatGantt(this.getFilteredTask(this.tasks)))
  }

  getTasks() {
    return toJS(this.getFilteredTask(this.tasks))
  }

  getProcessing() {
    return toJS(this.processing)
  }

  updateDependency(source_id, destination_id) {
    let url = `/api/v1/batches/${
      this.batch_id
    }/tasks/${source_id}/update_dependency?source_id=${source_id}&destination_id=${destination_id}`

    fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // let error_container = document.getElementById('error-container')
        if (data && data.data && data.data.id != null) {
          // error_container.style.display = 'none'
          toast('Task Updated', 'success')
          this.loadTasks(this.batch_id)
          this.processing = false
          // loadTasks.loadbatch(state.batch_id)
        } else {
          // let keys = Object.keys(data.errors)
          // console.log(data.errors[keys[0]])
          // error_container.style.display = 'block'
          // let error_message = document.getElementById('error-message')
          // error_message.innerHTML = data.errors[keys[0]]
          // let array = []
          // array[0] = data.errors[keys[0]]
          // ErrorStore.replace(array)
          // console.log(JSON.stringify(ErrorStore))
          toast(data.errors, 'error')
        }
      })
  }

  updateTask(task) {
    this.processing = true
    let new_task = task
    let id = task.id
    let end_date = task['_end']
    let start_date = task['_start']
    const found = toJS(this.tasks.find(x => x.id === task.id))
    if (found) {
      // this.tasks = this.tasks.map(u => (u.id === task.id ? task : u))

      let url = `/api/v1/batches/${this.batch_id}/tasks/${id}`
      let task = {
        assigned_employee: found.attributes.assigned_employee,
        batch_id: found.attributes.batch_id,
        days_from_start_date: found.attributes.days_from_start_date,
        depend_on: found.attributes.depend_on,
        duration: found.attributes.duration,
        end_date: end_date,
        start_date: start_date,
        estimated_hours: found.attributes.estimated_hours,
        id: id,
        is_category: found.attributes.is_category,
        is_phase: found.attributes.is_phase,
        name: found.attributes.name,
        parent_id: found.attributes.parent_id,
        phase: found.attributes.phase,
        position: found.attributes.position,
        task_category: found.attributes.task_category,
        time_taken: found.attributes.time_taken,
        task_type: found.attributes.task_type
      }

      fetch(url, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({ task: task }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          // let error_container = document.getElementById('error-container')
          if (data && data.data && data.data.id != null) {
            // error_container.style.display = 'none'
            toast('Task Updated', 'success')
            this.loadTasks(this.batch_id)
            this.processing = false
            // loadTasks.loadbatch(state.batch_id)
          } else {
            // let keys = Object.keys(data.errors)
            // console.log(data.errors[keys[0]])
            // error_container.style.display = 'block'
            // let error_message = document.getElementById('error-message')
            // error_message.innerHTML = data.errors[keys[0]]
            // let array = []
            // array[0] = data.errors[keys[0]]
            // ErrorStore.replace(array)
            // console.log(JSON.stringify(ErrorStore))
            toast(data.errors, 'error')
          }
        })
    } else {
      this.tasks.push(task)
    }
  }

  deleteTask(task) {
    const found = this.tasks.find(x => x.id === task.id)
    if (found) {
      this.tasks = this.tasks.map(u => u.id !== task.id)
    } else {
      this.tasks.push(task)
    }
  }

  setHiddenIds(parent_id) {
    let parent = this.tasks.find(e => e.id === parent_id)
    let children = this.tasks.filter(e => e.attributes.parent_id === parent.id)
    let children_ids = children.map(e => e.id)
    let children_2_ids = this.tasks
      .filter(e => children_ids.includes(e.attributes.parent_id))
      .map(e => e.id)
    console.log(children_ids)
    console.log(children_2_ids)
    this.hidden_ids = this.hidden_ids.concat(
      children_ids.concat(children_2_ids)
    )
  }

  clearHiddenIds(parent_id) {
    let parent = this.tasks.find(e => e.id === parent_id)
    let children = this.tasks
      .filter(e => e.attributes.parent_id === parent.id)
      .map(e => e.id)
    let children2 = this.tasks
      .filter(e => children.includes(e.attributes.parent_id))
      .map(e => e.id)
    children = children.concat(children2)
    let new_ids = toJS(this.hidden_ids).filter(e => !children.includes(e))
    this.hidden_ids = new_ids
  }

  formatGantt(tasks) {
    tasks = toJS(tasks)
    if (this.isLoaded) {
      let formatted_tasks = tasks.map(task => {
        const { id, name, start_date, end_date, parent_id } = task.attributes
        return {
          id,
          name,
          start: start_date,
          end: end_date,
          custom_class: this.getCustomClass(task),
          dependencies: this.getDependencies(task)
          // progress: parseInt(Math.random() * 100, 10)
        }
      })
      return formatted_tasks
    } else {
      return null
    }
  }

  getCustomClass(task) {
    if (task.attributes.is_phase === true) {
      return 'phase'
    }
    if (task.attributes.is_category === true) {
      return 'category'
    }
    if (
      task.attributes.is_category === false &&
      task.attributes.is_phase === false
    ) {
      return 'task'
    }
  }

  getDependencies(task) {
    // if (task.id === '5c0f63a1fb83872228537c91') {
    //   return '5c0f63a1fb83872228537c8b'
    // } else {
    return task.attributes.depend_on
    // ? task.attributes.depend_on
    // : task.attributes.parent_id
    // }
  }
}

const taskStore = new TaskStore()

export default taskStore
