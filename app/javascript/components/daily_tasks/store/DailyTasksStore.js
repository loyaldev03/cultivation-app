import { observable } from 'mobx'

const store = observable({
  dailyTasksByBatch: [],
  date: null,
  rawMaterials: [],
  selectedTask: null,
  editingPanel: null
})

export default store
