
import React from "react";
import { render } from "react-dom";
import { observable } from "mobx";
import { observer, Provider } from "mobx-react";

import taskStore from '../stores/TaskStore'


import ReactTable from "react-table"
import "react-table/react-table.css"

@observer
class TaskList extends React.Component {
  render() {
    return(
      <React.Fragment>
        {taskStore}
        <ReactTable
          columns={[
            {
              Header: "Phase",
              accessor: "phase",
              maxWidth: '100'
            },
            {
              Header: "Category",
              accessor: "task_category",
              maxWidth: '100'

            },
            {
              Header: "Name",
              accessor: "name"
            },
            {
              Header: "Start Date",
              accessor: "start_date",
              maxWidth: '100'
            },
            {
              Header: "End Date",
              accessor: "end_date",
              maxWidth: '100'
            },
            {
              Header: "Duration",
              accessor: "duration",
              maxWidth: '100'

            }
          ]}
          data={taskStore}
          rows={100}
          className="-striped -highlight"
          defaultPageSize={100}
        />

      </React.Fragment> 
   
    )
    // const list = taskStore.thelist.map((x, i) => <Item data={x} key={i} />
    //     return (<React.Fragment>{list}</React.Fragment>)

  }
}

export default TaskList
