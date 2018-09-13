import React from 'react'
import { render } from 'react-dom'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'

import TaskStore from '../stores/TaskStore'
import { editorSidebarHandler } from '../../../utils/EditorSidebarHandler'
import TaskEditor from './TaskEditor'
import updateSidebarTask from '../actions/updateSidebarTask'

import ReactTable from 'react-table'

@observer
class TaskList extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
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
    console.log(row.row.id)
    editorSidebarHandler.open({
      width: '500px',
      data: { id: row.row.id },
      action: 'add'
    })
  }

  render() {
    let tasks = TaskStore
    return (
      <React.Fragment>
        {tasks}
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
              Cell: row => <div>{this.renderAddButton(row)}</div>
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
          className="-striped -highlight"
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
