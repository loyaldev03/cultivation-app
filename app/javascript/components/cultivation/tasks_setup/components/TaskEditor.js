import React from 'react'
import { observer, Provider } from 'mobx-react'
import updateSidebarTask from '../actions/updateSidebarTask'

import TaskStore from '../stores/TaskStore'

import SidebarTaskEditor from './SidebarTaskEditor'
import AddTaskForm from './AddTaskForm'

const styles = `

.active{
    display: inline-block;
  position: relative;
}

.active:after:after {
  position: absolute;
  content: '';
  border-bottom: 1px solid red;
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
    const _this = this
    document.addEventListener('editor-sidebar-open', function(ev) {
      _this.setState({
        id: ev.detail.data.id,
        action: ev.detail.action,
        task_related_id: ev.detail.data.task_related_id,
        position: ev.detail.data.position
      })
    })
  }

  onChangeHandler(attr, value) {
    sidebarTask[attr] = value.persist()
  }

  renderSidebarTaskEditor() {
    //find task here and send
    let task = TaskStore.find(e => e.id === this.state.id)
    if (this.state.action === 'update') {
      if (task === undefined) return null
      return (
        <SidebarTaskEditor
          id={this.state.id}
          task={task}
          batch_id={this.props.batch_id}
        />
      )
    } else {
      return (
        <AddTaskForm
          batch_id={this.props.batch_id}
          task_related_id={this.state.task_related_id}
          position={this.state.position}
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

  render() {
    return (

      <div className="rc-slide-panel" data-role="sidebar">
        <style> {styles} </style>
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <div className="mt3 mb3 flex">
              <div className="w-40 ph4 active">
                General
              </div>
              <div className="w-40 pl3 ph4">
                Resource
              </div>
              <div className="w-40 pl3 ph4">
                Material
              </div>
            </div>
            {this.renderCloseSidebar()}
          </div>

          {this.renderSidebarTaskEditor()}
        </div>
      </div>
    )
  }
}
