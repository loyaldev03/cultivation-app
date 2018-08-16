
import React from "react";
import { render } from "react-dom";

import { observable } from "mobx";
import { observer, Provider } from "mobx-react";

import loadTasks from './actions/loadTask'
import TaskList from './components/TaskList'


import ReactTable from "react-table"
import "react-table/react-table.css"

import TaskStore from "./stores/TaskStore"
@observer
class BatchPlanner extends React.Component {

  componentDidMount() {
    loadTasks.loadbatch(this.props.batch_id)
  }

  render() {
    
    //return "hello"
    return (
      <Provider store={TaskStore}>
        <TaskList />
      </Provider>

    )
  }

}

export default BatchPlanner
