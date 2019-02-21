import { httpGetOptions } from '../../utils/FetchHelper'
import currentTaskStore from '../stores/CurrentTaskStore'

// TODO: not complete yet
const getDailyTaskDetails = taskId => {
  const getIssues = fetch(
    `/api/v1/issues/${taskId}/comments`,
    httpGetOptions
  ).then(response => response.json())
  const getMaterials = fetch(
    `/api/v1/issues/${taskId}/comments`,
    httpGetOptions
  ).then(response => response.json())
  const getNotes = fetch(
    `/api/v1/issues/${taskId}/comments`,
    httpGetOptions
  ).then(response => response.json())

  Promise.all([getIssues, getMaterials, getNotes]).then(
    ([issues, materials, notes]) => {
      console.log(issues)
      console.log(materials)
      console.log(notes)

      // Set new data to the currentTaskStore
      currentTaskStore.loadMaterialsUsed(materials)
      currentTaskStore.loadIssues(issues)
      currentTaskStore.loadNotes(notes)
    }
  )
}

export default getDailyTaskDetails
