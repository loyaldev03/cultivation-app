import React from 'react'
import { toJS } from 'mobx'
import { SlidePanelHeader, SlidePanelFooter } from '../../utils'
import dailyTaskSidebarStore from '../stores/SidebarStore'
import dailyTasksStore from '../stores/DailyTasksStore'

class NoteEditor extends React.Component {
  componentDidMount() {
    dailyTaskSidebarStore.showNotes.observe(change => {
      if (change.newValue) {
        this.setBody(dailyTaskSidebarStore.noteBody)
      }
    })
  }

  onSave = () => {
    const taskId = dailyTaskSidebarStore.taskId
    const noteId = dailyTaskSidebarStore.noteId
    const body = this.inputText.value
    this.inputText.value = ''

    dailyTasksStore.editNote(taskId, noteId, body)
    dailyTaskSidebarStore.closeNotes()
  }

  onClose = () => {
    dailyTaskSidebarStore.closeNotes()
  }

  setBody = body => {
    this.inputText.value = body
  }

  render() {
    const { onClose, onSave } = this.props
    const title = dailyTaskSidebarStore.noteId ? 'Update Note' : 'Add Note'

    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader onClose={this.onClose} title={title} />
        <div className="flex flex-column flex-auto justify-between">
          <div className="pa3 flex flex-column">
            <label className="grey mb2">Notes:</label>
            <textarea
              ref={input => (this.inputText = input)}
              className="dark-grey"
              className="w-100 b--light-grey"
              rows={7}
            />
          </div>
        </div>
        <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
      </div>
    )
  }
}

export default NoteEditor
