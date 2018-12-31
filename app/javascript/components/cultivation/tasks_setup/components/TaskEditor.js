import React from 'react'
import { observer, Provider } from 'mobx-react'

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

@observer
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
      action: '',
      task_related_id: '',
      position: ''
    } // or set from props
    this.onResetEditor = this.onResetEditor.bind(this)
    this.onClose = this.onClose.bind(this)
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', this.onOpen)
  }

  componentWillUnmount() {
    document.removeEventListener('editor-sidebar-open', this.onOpen)
  }

  onChangeHandler(attr, value) {
    sidebarTask[attr] = value.persist()
  }

  onOpen = ev => {
    if (ev.detail && ev.detail.taskId) {
      const { taskId, action } = ev.detail
      const task = TaskStore.getTaskById(taskId)
      this.setState({
        tabs: 'General',
        id: task.id,
        action: action,
        task: task,
        task_related_id: task.task_related_id,
        task_related_parent_id: task.task_related_id,
        position: task.position
      })
    }
  }

  renderSidebarTaskEditor() {
    //find task here and send
    const { batch_id } = this.props
    const { id, action, tabs, task, position } = this.state
    if (action === 'update') {
      if (!task) return null
      if (tabs === 'General') {
        return <SidebarTaskEditor id={id} task={task} batch_id={batch_id} />
      }
      if (tabs === 'Resource') {
        return <ResourceForm id={id} task={task} batch_id={batch_id} />
      }
      if (tabs === 'Material') {
        return <MaterialForm id={id} task={task} batch_id={batch_id} />
      }
    } else {
      return (
        <AddTaskForm
          batch_id={batch_id}
          task_related_id={this.state.task_related_id}
          task_related_parent_id={this.state.task_related_parent_id}
          position={position}
          handleReset={this.props.handleReset}
        />
      )
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

  changeTabs = value => {
    this.setState({ tabs: value })
  }

  render() {
    let changeTabs = this.changeTabs
    let isNormalTask = true
    // TODO: Need to switch to wbs
    // this.state.task &&
    // this.state.task.attributes.is_phase === false &&
    // this.state.task.attributes.is_category === false
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
                this.state.tabs === 'General' ? 'active' : null
              }`}
              onClick={() => changeTabs('General')}
            >
              General
            </div>
            {isNormalTask ? (
              <div
                className={`pl3 ph4 pointer dim ${
                  this.state.tabs === 'Resource' ? 'active' : null
                }`}
                onClick={() => changeTabs('Resource')}
              >
                Resource
              </div>
            ) : null}
            {isNormalTask ? (
              <div
                className={`pl3 ph4 pointer dim ${
                  this.state.tabs === 'Material' ? 'active' : null
                }`}
                onClick={() => changeTabs('Material')}
              >
                Material
              </div>
            ) : null}
          </div>
          {this.renderCloseSidebar()}
        </div>
        {this.renderSidebarTaskEditor()}
      </div>
    )
  }
}
