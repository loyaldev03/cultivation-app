import { observable } from 'mobx'

const store = observable({
  dailyTasksByBatch: [],
  date: null,
  inventoryCatalogue: [],
  selectedTask: null,
  editingPanel: null
})

export default store
