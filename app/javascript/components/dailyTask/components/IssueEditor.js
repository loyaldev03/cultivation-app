import React from 'react'
import { toJS } from 'mobx'
import { SlidePanelHeader, SlidePanelFooter } from '../../utils'
import SidebarStore from '../stores/SidebarStore'
import DailyTasksStore from '../stores/DailyTasksStore'

class IssueEditor extends React.Component {
  componentDidMount() {
    SidebarStore.showIssues.observe(change => {
      if (change.newValue) {
        this.setBody(SidebarStore.noteBody)
      }
    })
  }

  onSave = () => {
    const taskId = SidebarStore.taskId
    const noteId = SidebarStore.noteId
    const body = this.inputText.value
    this.inputText.value = ''

    DailyTasksStore.editNote(taskId, noteId, body)
    SidebarStore.closeSidebar()
  }

  onClose = () => {
    SidebarStore.closeSidebar()
  }

  setBody = body => {
    this.inputText.value = body
  }

  render() {
    const { onClose, onSave } = this.props
    const title = SidebarStore.noteId ? 'Update Note' : 'Issue Detail'

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
