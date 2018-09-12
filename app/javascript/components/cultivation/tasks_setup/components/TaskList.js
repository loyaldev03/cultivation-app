import React from 'react'
import { render } from 'react-dom'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'

import TaskStore from '../stores/TaskStore'
import { editorSidebarHandler } from '../../../utils/EditorSidebarHandler'
import TaskEditor from './TaskEditor'
import updateSidebarTask from '../actions/updateSidebarTask'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

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
              show: true
            },
            {
              Header: 'Phase',
              accessor: 'attributes.phase',
              maxWidth: '100'
            },
            {
              Header: 'Category',
              accessor: 'attributes.task_category',
              maxWidth: '100'
            },
            {
              Header: 'Name',
              accessor: 'attributes.name'
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
            // {
            //   Header: "Parent",
            //   accessor: "attributes.parent_id"

            // },
            // {
            //   Header: "Depend On",
            //   accessor: "attributes.depend_on"
            // },
            // {
            //   Header: "Category?",
            //   accessor: "attributes.isCategory",
            // },
            // {
            //   Header: "Phase?",
            //   accessor: "attributes.isPhase",
            // }
          ]}
          data={tasks}
          rows={100}
          className="-striped -highlight"
          defaultPageSize={100}
          getTrProps={(state, rowInfo, column) => {
            if (rowInfo) {
              return {
                style: {
                  // background: rowInfo.row['attributes.isPhase'] == "true" ? '#bdbdbd' : null,
                },
                onClick: (e, handleOriginal) => {
                  // console.log(handleOriginal)
                  editorSidebarHandler.open({ width: '500px', data: rowInfo.row })
                }
              }
            }
            return {}
          }
        }
        />
        <TaskEditor onClose={this.closeSidebar} batch_id={this.props.batch_id} />
      </React.Fragment>
    )
  }
}

export default TaskList
