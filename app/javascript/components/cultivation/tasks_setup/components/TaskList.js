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
              accessor: 'attributes.duration',
              maxWidth: '100'
            }
          ]}
          data={tasks}
          rows={100}
          className="-striped -highlight"
          defaultPageSize={100}
          getTrProps={(state, rowInfo) => {
            return {
              onClick: e => {
                // console.log(rowInfo.row)
                // updateSidebarTask.update(rowInfo.row)
                editorSidebarHandler.open({ width: '500px', data: rowInfo.row })
              }
            }
          }}
        />
        <TaskEditor
          onClose={this.closeSidebar}
          batch_id={this.props.batch_id}
        />
      </React.Fragment>
    )
    // const list = TaskStore.thelist.map((x, i) => <Item data={x} key={i} />
    //     return (<React.Fragment>{list}</React.Fragment>)
  }
}

export default TaskList
