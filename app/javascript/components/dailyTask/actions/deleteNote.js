import { httpDeleteOptions } from '../../utils/FetchHelper'
import dailyTasksStore from '../stores/DailyTasksStore'

const deleteNote = (taskId, noteId) => {
  const url = `/api/v1/daily_tasks/${taskId}/notes/${noteId}`
  return fetch(url, httpDeleteOptions())
    .then(function(response) {
      return response.json()
    })
    .then(data => {
      dailyTasksStore.deleteNote(taskId, data.data)
    })
}

export default deleteNote
