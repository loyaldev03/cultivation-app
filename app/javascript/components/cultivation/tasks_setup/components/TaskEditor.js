import React from 'react'
import TaskStore from '../stores/NewTaskStore'
import SidebarTaskEditor from './SidebarTaskEditor'
import AddTaskForm from './AddTaskForm'
import MaterialForm from './MaterialForm'
import ResourceForm from './ResourceForm'

const styles = `

.active{
    display: inline-block;
    position: relative;
    border-bottom: 3px solid var(--orange);
    padding-bottom: 16px;
}

.active:after {
  position: absolute;
  content: '';
  width: 70%;
  transform: translateX(-50%);
  bottom: -15px;
  left: 50%;
}

`

export default class TaskEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: 'General',
      id: '',
      strain: '',
      strain_type: '',
      facility_id: '',
      stockEditor: '',
      source: '',
      action: ''
    } // or set from props
    this.onResetEditor = this.onResetEditor.bind(this)
    this.onClose = this.onClose.bind(this)
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    const { taskId, taskAction } = this.props
    if (
      taskId &&
      taskAction &&
      (taskId !== prevProps.taskId || taskAction !== prevProps.taskAction)
    ) {
      if (taskAction === 'update') {
        const task = TaskStore.getTaskById(taskId)
        this.setState({
          tabs: 'General',
          id: taskId,
          action: taskAction,
          task: task,
          relativeTaskId: null
        })
      }
      if (taskAction === 'add-above' || taskAction === 'add-below') {
        this.setState({
          tabs: 'General',
          action: taskAction,
          task: null,
          relativeTaskId: taskId
        })
      }
    }
  }

  renderSidebarTaskEditor(haveChildren) {
    //find task here and send
    const { batchId } = this.props
    const { id, relativeTaskId, action, tabs, task } = this.state
    if (action === 'update') {
      if (!task) return null
      if (tabs === 'General') {
        return (
          <SidebarTaskEditor
            key={id}
            id={id}
            task={task}
            batchId={batchId}
            showEstimatedHoursField={!haveChildren}
          />
        )
      }
      if (tabs === 'Resource') {
        return <ResourceForm key={id} id={id} task={task} batch_id={batchId} />
      }
      if (tabs === 'Material') {
        return <MaterialForm key={id} id={id} task={task} batch_id={batchId} />
      }
    } else {
      return (
        <SidebarTaskEditor
          key={relativeTaskId + action}
          task={task}
          batchId={batchId}
          showEstimatedHoursField={true}
        />
      )
      // return (
      //   <AddTaskForm
      //     key={id + action}
      //     batchId={batchId}
      //     relativeTaskId={relativeTaskId}
      //     action={action}
      //     handleReset={this.props.handleReset}
      //   />
      // )
    }
  }

  get editorSelected() {
    return this.state.stockEditor.length > 0
  }

  onResetEditor(event) {
    this.setState({ stockEditor: '' })
    event.preventDefault()
  }

  onClose() {
    // reset everything before close.
    this.props.handleReset()
    this.props.onClose()
  }

  renderTitle() {
    if (this.state.action == 'update') {
      return 'Update Task'
    } else {
      return 'Add New Task'
    }
  }

  renderCloseSidebar() {
    if (this.editorSelected) {
      return (
        <div
          className="dim gray f7 pv1 flex fw4 pointer ttu"
          onClick={this.onResetEditor}
        >
          Cancel
        </div>
      )
    } else {
      return (
        <span
          className="rc-slide-panel__close-button dim"
          onClick={this.onClose}
        >
          <i className="material-icons mid-gray md-18">close</i>
        </span>
      )
    }
  }

  changeTabs = value => e => {
    this.setState({ tabs: value })
  }

  render() {
    const { task, tabs } = this.state
    const haveChildren =
      task && task.wbs ? TaskStore.haveChildren(task.wbs) : false
    return (
      <div className="flex flex-column">
        <style> {styles} </style>
        <div
          className="ph4 pv2 bb b--light-gray flex items-center"
          style={{ height: '51px' }}
        >
          <div className="mt3 flex content-stretch">
            <div
              className={`ph4 pointer dim ${
                tabs === 'General' ? 'active' : null
              }`}
              onClick={this.changeTabs('General')}
            >
              General
            </div>
            {!haveChildren ? (
              <div
                className={`pl3 ph4 pointer dim ${
                  tabs === 'Resource' ? 'active' : null
                }`}
                onClick={this.changeTabs('Resource')}
              >
                Resource
              </div>
            ) : null}
            {!haveChildren ? (
              <div
                className={`pl3 ph4 pointer dim ${
                  tabs === 'Material' ? 'active' : null
                }`}
                onClick={this.changeTabs('Material')}
              >
                Material
              </div>
            ) : null}
          </div>
          {this.renderCloseSidebar()}
        </div>
        {this.renderSidebarTaskEditor(haveChildren)}
      </div>
    )
  }
}
