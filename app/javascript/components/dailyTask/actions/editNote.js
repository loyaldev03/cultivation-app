import { httpPostOptions } from '../../utils/FetchHelper'
import dailyTasksStore from '../stores/DailyTasksStore'

const editNote = (taskId, noteId, body) => {
  const url = `/api/v1/daily_tasks/${taskId}/update_note`
  const payload = { note_id: noteId, body }
  return fetch(url, httpPostOptions(payload))
    .then(function(response) {
      return response.json()
    })
    .then(data => {
      dailyTasksStore.updateNote(data.data)
    })
}

export default editNote
