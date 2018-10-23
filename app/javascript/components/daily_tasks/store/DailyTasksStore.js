import { observable } from 'mobx'

const store = observable({
  dailyTasksByBatch: [],
  date: null,
  selectedTask: null,
  editingPanel: null
})

export default store