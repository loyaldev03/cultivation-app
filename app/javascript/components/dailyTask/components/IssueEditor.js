import React from 'react'
import { toJS } from 'mobx'
import { SlidePanelHeader, SlidePanelFooter } from '../../utils'
import dailyTaskSidebarStore from '../stores/SidebarStore'
import dailyTasksStore from '../stores/DailyTasksStore'

class IssueEditor extends React.Component {
  componentDidMount() {
    dailyTaskSidebarStore.showIssues.observe(change => {
      console.log('notes changing')
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
    const title = dailyTaskSidebarStore.noteId ? 'Update Note' : 'Issue Detail'

    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader onClose={this.onClose} title={title} />
        <div className="flex flex-column flex-auto justify-between">
          <div className="pa3 flex flex-column" />
        </div>
        <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
      </div>
    )
  }
}

export default IssueEditor
