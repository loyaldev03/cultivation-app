import React from 'react'
import { render } from 'react-dom'

import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { formatDate2 } from '../../utils'
import GanttChart from './GanttChart'
import TaskStore from '../tasks_setup/stores/NewTaskStore'
import BatchHeader from '../shared/BatchHeader'
import BatchTabs from '../shared/BatchTabs'
import loadUnresolvedIssueCount from '../../issues/actions/loadUnresolvedIssueCount'
@observer
class GanttSetup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: props.batch,
      tasks: props.tasks,
      unresolvedIssueCount: 0
    }
  }

  async componentDidMount() {
    await TaskStore.loadTasks(this.props.batch_id)
    loadUnresolvedIssueCount(this.props.batch.id).then(x => {
      this.setState({ unresolvedIssueCount: x.count })
    })
  }

  render() {
    const { batch } = this.props

    let activeTabs =
      'link bb-r br-r bt-l br-l pv3 ph4 b--black-10 f6 fw6 dark-gray hover-bg-light-gray bg-white'
    let inactiveTabs =
      'link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white'
    return (
      <React.Fragment>
        <BatchHeader {...batch} />
        <BatchTabs
          batch={batch}
          currentTab="gantChart"
          unresolvedIssueCount={this.state.unresolvedIssueCount}
        />
        <div className="flex flex-column justify-between bg-white box--shadow">
          <div className="pa4">
            <div className="fl w-100 flex flex-column">
              <GanttChart batch_id={this.props.batch_id} />
            </div>
          </div>
        </div>

        <div id="toast" className="toast animated toast--success">
          Row Saved
        </div>
        <br />
      </React.Fragment>
    )
  }
}

export default GanttSetup
