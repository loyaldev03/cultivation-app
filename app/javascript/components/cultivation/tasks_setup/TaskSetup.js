
import React from "react";
import { render } from "react-dom";

import { observable } from "mobx";
import { observer, Provider } from "mobx-react";

import loadTasks from './actions/loadTask'
import TaskList from './components/TaskList'

class TaskSetup extends React.Component {

  componentDidMount() {
    loadTasks.loadbatch(this.props.batch_id)
  }


  render() {
    return (
      <React.Fragment>
        <TaskList batch_id={this.props.batch_id}/>
        <div id="toast" className="toast animated toast--success">Row Saved</div>
      </React.Fragment>
    )
  }

}

export default TaskSetup
