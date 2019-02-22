import React from 'react'
import {
  wbsWidth,
  taskWidth,
  locationWidth,
  btnWidth,
  statusWidth
} from './TaskTableStyles'
import ExpandedRow from './ExpandedRow'
import getDailyTaskDetails from '../actions/getDailyTaskDetails'
import { toast } from '../../utils'
import DailyTaskStore from '../stores/DailyTasksStore'
import classNames from 'classnames'

class TaskRow extends React.Component {
  state = {
    expanded: false,
    work_status: this.props.work_status
  }

  componentDidMount() {
    console.log(this.props)
  }

  onExpand = event => {
    console.log('expanded')
    console.log(
      `this should call getDailyTaskDetails('${
        this.props.id
      }') method if it is an expansion...`
    )

    if (!this.state.expanded) {
      getDailyTaskDetails(this.props.id)
    }
    this.setState({ expanded: !this.state.expanded })
    event.preventDefault()
  }

  onToggleStart = event => {
    console.log('onToggleStart')
    if (this.state.work_status !== 'done') {
      const default_status = ['stopped', 'stuck', 'done']
      if (default_status.includes(this.state.work_status)) {
        let status_before = this.state.work_status
        DailyTaskStore.updateTimeLog('start', this.props.id)
        this.setState({ work_status: 'started' })
        if (status_before == 'stuck') {
          toast(`Removed stuck status.`, 'success')
        } else {
          toast(`Start time recorded`, 'success')
        }
      } else {
        DailyTaskStore.updateTimeLog('stop', this.props.id)
        this.setState({ work_status: 'stopped' })
        toast(`End time recorded`, 'success')
      }
    }
  }

  onClickStatus = action => {
    DailyTaskStore.updateTimeLog(action, this.props.id)
    this.setState({ work_status: action })
    if (action === 'stuck') {
      toast(`Supervisor is notified.`, 'success')
    } else {
      toast(`Status changed to done`, 'success')
    }
  }

  renderExpanded() {
    if (!this.state.expanded) {
      return null
    }

    return (
      <ExpandedRow
        taskId={this.props.id}
        onToggleAddIssue={this.props.onToggleAddIssue}
        onToggleAddMaterial={this.props.onToggleAddMaterial}
        onToggleAddNotes={this.props.onToggleAddNotes}
        onClickStatus={this.onClickStatus}
      />
    )
  }

  renderIssueCount(issues) {
    if (issues.length <= 0) {
      return null
    }

    return (
      <span
        className="mr2 material-icons red pointer"
        style={{ fontSize: '17px' }}
      >
        error_outline
      </span>
    )
  }

  render() {
    const { wbs, name, location_name, location_type, issues } = this.props

    return (
      <div className="bb b--black-05">
        <div className="flex items-center pv1 dark-gray">
          <div
            className="flex items-center justify-center f6 pa2"
            style={wbsWidth}
          >
            {wbs}
          </div>

          <div
            className="flex items-center justify-start pa2"
            style={taskWidth}
          >
            <span
              className="mr1 material-icons black-20 pointer"
              style={{ fontSize: '20px', width: '30px' }}
              onClick={this.onExpand}
            >
              {this.state.expanded
                ? 'keyboard_arrow_down'
                : 'keyboard_arrow_right'}
            </span>
            {this.renderIssueCount(issues)}
            <span className="f6 pointer" onClick={this.onExpand}>
              {name}
            </span>
          </div>

          <div
            className="flex items-center justify-start pa2"
            style={locationWidth}
          >
            <span className="f6">
              {location_type} {location_name}
            </span>
          </div>

          <div className="flex items-center justify-center " style={btnWidth}>
            <span
              className={classNames(
                'mr1 material-icons pointer pa2',
                { orange: this.state.work_status !== 'done' },
                { grey: this.state.work_status === 'done' }
              )}
              style={{ fontSize: '20px' }}
              onClick={this.onToggleStart}
            >
              {this.state.work_status === 'started' ? 'pause' : 'play_arrow'}
            </span>
          </div>

          <div
            className="flex items-center justify-center pa2"
            style={statusWidth}
          >
            <span className="f6 black-30 ttc">
              {this.state.work_status.replace(/[_]/g, ' ')}
            </span>
          </div>
        </div>
        {this.renderExpanded()}
      </div>
    )
  }
}

export default TaskRow
