import React from 'react'
import { observer, Provider } from "mobx-react";
import sidebarTask from '../stores/SidebarTaskStore'
import updateSidebarTask from '../actions/updateSidebarTask'

import TaskStore from '../stores/TaskStore'


import SidebarTaskEditor from './SidebarTaskEditor'

@observer
export default class TaskEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strain: '',
      strain_type: '',
      facility_id: '',
      stockEditor: '',
      source: ''
    } // or set from props
    this.onResetEditor = this.onResetEditor.bind(this)
    this.onClose = this.onClose.bind(this)
  }

  onChangeHandler(attr, value){
    sidebarTask[attr] = value.persist()
    // updateSidebarTask.update_attr(attr, value)
  }

  renderSidebarTaskEditor() {
    //find task here and send
    if (sidebarTask.id === undefined) return null
    let task = TaskStore.find(e => e.id === sidebarTask.id);
    return <SidebarTaskEditor id={sidebarTask.id} task={task} />
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
    this.props.onClose()
  }

  renderTitle() {
    return 'Update Task'
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
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">
              {this.renderTitle()}
            </h1>
            {this.renderCloseSidebar()}
          </div>

          {this.renderSidebarTaskEditor()}

<p>
Details to show in the sidebar:
1. Task name
2. Task category: prepare, clone, clean, waiting (based on Brian's task sheet).
3. Instructions for the worker
4. Days
5. Start date
6. end date
7. Estimated Hours needed
8. Assigned employees
9. Materials & suggested qty
9.1 Some materials may need to be further specified e.g. particular nutrient inventory to use.
</p>
        </div>
      </div>
    )
  }
}
