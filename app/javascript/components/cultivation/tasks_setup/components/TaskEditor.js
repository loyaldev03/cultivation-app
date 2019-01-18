import React from 'react'
import TaskStore from '../stores/NewTaskStore'
import { SlidePanelHeader, SlidePanelFooter } from '../../../utils'
import SidebarTaskEditor from './SidebarTaskEditor'

export default class TaskEditor extends React.Component {
  componentDidUpdate(prevProps) {
    const { taskId, taskAction } = this.props
    if (
      taskId &&
      taskAction &&
      (taskId !== prevProps.taskId || taskAction !== prevProps.taskAction)
    ) {
      const task = TaskStore.getTaskById(taskId)
      if (taskAction === 'update') {
        this.editor.setEditingTask(task)
      } else {
        this.editor.setEditingTask(null, task.start_date)
      }
    }
  }

  getTitle(action) {
    if (action == 'update') {
      return 'Update Task'
    } else {
      return 'Add New Task'
    }
  }

  onSave = () => {
    const updates = this.editor.getEditingTask()
    const { batchId, taskId, taskAction } = this.props
    if (taskAction === 'update') {
      TaskStore.editTask(batchId, taskId, updates)
    } else {
      TaskStore.createTask(batchId, taskId, taskAction, updates)
    }
    this.props.onClose()
  }

  render() {
    const { onClose, taskId, taskAction, batchId } = this.props
    if (!taskId) {
      return null
    }
    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader onClose={onClose} title={this.getTitle(taskAction)} />
        <SidebarTaskEditor
          ref={editor => (this.editor = editor)}
          taskId={taskId}
          batchId={batchId}
        />
        <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
      </div>
    )
  }
}
