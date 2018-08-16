
import React from "react";
import { render } from "react-dom";

import { observable } from "mobx";
import { observer } from "mobx-react";

import loadTasks from './actions/loadTask'
// import TaskList from './components/TaskList'


import ReactTable from "react-table"
import "react-table/react-table.css"

@observer
class BatchPlanner extends React.Component {

  componentDidMount() {
    loadTasks.loadbatch(this.props.batch_id)
  }

  render() {
    return "hello"
    // return <TaskList/>
  }

}

export default BatchPlanner
