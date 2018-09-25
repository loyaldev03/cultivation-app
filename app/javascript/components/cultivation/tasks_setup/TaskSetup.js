import React from 'react'
import { render } from 'react-dom'

import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'

import loadTasks from './actions/loadTask'
import TaskList from './components/TaskList'

class TaskSetup extends React.Component {
  componentDidMount() {
    loadTasks.loadbatch(this.props.batch_id)
  }

  render() {
    return (
      <React.Fragment>
        <TaskList batch_id={this.props.batch_id} batch={this.props.batch} />
        <div id="toast" className="toast animated toast--success">
          Row Saved
        </div>
        <a
          href={'/cultivation/batches/' + this.props.batch_id + '?type=active'}
          data-method="put"
          className="flex-none bg-orange link white f6 fw6 pv2 ph3 br2 dim mt3"
        >
          Save & Continue
        </a>
      </React.Fragment>
    )
  }
}

export default TaskSetup
