import React from 'react'
import { render } from 'react-dom'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'

import TaskStore from '../stores/TaskStore'
import { editorSidebarHandler } from '../../../utils/EditorSidebarHandler'
import TaskEditor from './TaskEditor'
import updateSidebarTask from '../actions/updateSidebarTask'
import updateTask from '../actions/updateTask'

import ReactTable from 'react-table'

@observer
class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.dragged = null
  }

  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    let _this = this

    // need to find after data react-table is loaded callback
    setTimeout(function() {
      _this.mountEvents()
    }, 5000)
  }

  openSidebar = () => {
    window.editorSidebar.open({ width: '500px' })
  }

  closeSidebar = () => {
    window.editorSidebar.close()
  }

  renderAddButton = row => {
    if (row.value == true) {
      return (
        <div>
          <i
            className="material-icons md-600 md-gray md-17 ph2 cursor-pointer"
            onClick={e => {
              this.handleAddTask(row)
            }}
          >
            add
          </i>
        </div>
      )
    }
  }

  renderPhaseColumn = row => {
    if (row.row['attributes.isPhase'] == true) {
      return <div>{row.value}</div>
    }
  }

  renderCategoryColumn = row => {
    if (row.row['attributes.isCategory'] == true) {
      return <div>{row.value}</div>
    }
  }

  handleAddTask = row => {
    // console.log(row.row.id)
    editorSidebarHandler.open({ width: '500px', data: {}, action: 'add' })
  }

  mountEvents() {
    const headers = Array.prototype.slice.call(
      document.querySelectorAll('.rt-tr-group')
    )

    headers.forEach((header, i) => {
      header.setAttribute('draggable', true)
      //the dragged header
      header.ondragstart = e => {
        e.stopPropagation()
        this.dragged = i
      }

      header.ondrag = e => e.stopPropagation

      header.ondragend = e => {
        e.stopPropagation()
        setTimeout(() => (this.dragged = null), 1000)
      }

      //the dropped header
      header.ondragover = e => {
        // e.target.style.borderColor = "red"
        // console.log(e)
        e.preventDefault()
      }

      header.ondragenter = e => {
        console.log('enter')
        // e.target.style.borderColor = "red"
        e.target.closest('.rt-tr-group').style.borderBottomColor =
          'rgb(255,112,67)'
      }

      header.ondragleave = e => {
        console.log('leave')
        e.target.closest('.rt-tr-group').style.borderBottomColor = ''
      }

      header.ondrop = e => {
        e.preventDefault()
        e.target.closest('.rt-tr-group').style.borderBottomColor = ''

        // console.log(i === "")
        // console.log(i)
        // console.log(this.dragged === "")
        // console.log(this.dragged)
        if (this.dragged !== null && i !== null) {
          TaskStore.splice(i, 0, TaskStore.splice(this.dragged, 1)[0])
        }
        // if (i !== null && this.dragged !== null) {
        //   TaskStore.splice(i, 0, TaskStore.splice(this.dragged, 1)[0]);
        //   console.log('checking ')
        //   console.log(i == "")
        //   console.log(this.dragged == "")
        // }
        // updateTask.updatePosition(this.state, i, this.dragged)
      }
    })
  }

  render() {
    let tasks = TaskStore

    // this.reorder.forEach(o => tasks.splice(o.a, 0, tasks.splice(o.b, 1)[0]));

    return (
      <React.Fragment>
        {tasks}
        <div className="mb4">
          <a
            className="flex-none bg-orange link white f6 fw6 pv2 ph3 br2 dim"
            onClick={this.handleAddTask}
          >
            New Task
          </a>
        </div>

        <ReactTable
          columns={[
            {
              Header: 'Id',
              accessor: 'id',
              maxWidth: '100',
              show: false
            },
            {
              Header: '',
              accessor: 'attributes.isCategory',
              maxWidth: '50',
              id: 'button-column',
              show: false
              // Cell: (row) => (<div>{this.renderAddButton(row)}</div>)
            },
            {
              Header: 'Phase',
              accessor: 'attributes.phase',
              maxWidth: '100',
              Cell: row => <div>{this.renderPhaseColumn(row)}</div>
            },
            {
              Header: 'Category',
              accessor: 'attributes.task_category',
              maxWidth: '100',
              Cell: row => <div>{this.renderCategoryColumn(row)}</div>
            },
            {
              Header: 'Name',
              accessor: 'attributes.name',
              maxWidth: '300'
            },
            {
              Header: 'Start Date',
              accessor: 'attributes.start_date',
              maxWidth: '100'
            },
            {
              Header: 'End Date',
              accessor: 'attributes.end_date',
              maxWidth: '100'
            },
            {
              Header: 'Duration',
              accessor: 'attributes.days',
              maxWidth: '100'
            },
            {
              Header: 'Parent',
              accessor: 'attributes.parent_id',
              show: false
            },
            {
              Header: 'Depend On',
              accessor: 'attributes.depend_on',
              show: false
            },
            {
              Header: 'Category?',
              accessor: 'attributes.isCategory',
              show: false
            },
            {
              Header: 'Phase?',
              accessor: 'attributes.isPhase',
              show: false
            }
          ]}
          data={tasks}
          rows={100}
          // className="-striped -highlight"
          defaultPageSize={100}
          getTdProps={(state, rowInfo, column, instance) => {
            if (rowInfo) {
              return {
                onClick: (e, handleOriginal) => {
                  if (column.id != 'button-column') {
                    editorSidebarHandler.open({
                      width: '500px',
                      data: rowInfo.row,
                      action: 'update'
                    })
                  }
                }
              }
            }
            return {}
          }}
        />
        <TaskEditor
          onClose={this.closeSidebar}
          batch_id={this.props.batch_id}
        />
      </React.Fragment>
    )
  }
}

export default TaskList
