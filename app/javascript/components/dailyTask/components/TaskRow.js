import React from 'react'
import {
  wbsWidth,
  taskWidth,
  estimatedHoursWidth,
  locationWidth,
  btnWidth,
  statusWidth
} from './TaskTableStyles'
import ExpandedRow from './ExpandedRow'
import { toast } from '../../utils'
import DailyTaskStore from '../stores/DailyTasksStore'
import classNames from 'classnames'
class TaskRow extends React.Component {
  state = {
    expanded: false,
    work_status: this.props.work_status
  }

  onExpand = event => {
    this.setState({ expanded: !this.state.expanded })
    event.preventDefault()
  }

  onToggleStart = event => {
    if (this.props.work_status !== 'done') {
      const default_status = ['stopped', 'stuck', 'done', 'new']
      if (default_status.includes(this.props.work_status)) {
        let status_before = this.props.work_status
        DailyTaskStore.updateTimeLog(
          'started',
          this.props.id,
          this.props.batch_id
        )
        if (status_before == 'stuck') {
          toast('Removed stuck status.', 'success')
        } else {
          toast('Start time recorded', 'success')
        }
      } else {
        DailyTaskStore.updateTimeLog(
          'stopped',
          this.props.id,
          this.props.batch_id
        )
        toast('End time recorded', 'success')
      }
    }
  }

  onClickStatus = action => {
    if (this.props.work_status !== 'done') {
      if (action === 'done') {
        if (
          window.confirm('Are you sure you want to change status to done ?')
        ) {
          DailyTaskStore.updateTimeLog(
            action,
            this.props.id,
            this.props.batch_id
          )
          this.setState({ work_status: action })
          toast('Status changed to done', 'success')
        }
      } else {
        DailyTaskStore.updateTimeLog(action, this.props.id, this.props.batch_id)
        this.setState({ work_status: action })
        toast('Supervisor is notified.', 'success')
      }
    }
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
    const {
      wbs,
      name,
      location_name,
      location_type,
      issues,
      estimated_hours
    } = this.props

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
            className="flex items-center justify-center pa2 tc"
            style={estimatedHoursWidth}
          >
            <span className="f6 tc">{estimated_hours}</span>
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
                { orange: this.props.work_status !== 'done' },
                { grey: this.props.work_status === 'done' }
              )}
              style={{ fontSize: '20px' }}
              onClick={this.onToggleStart}
            >
              {this.props.work_status === 'started' ? 'pause' : 'play_arrow'}
            </span>
          </div>

          <div
            className="flex items-center justify-center pa2"
            style={statusWidth}
          >
            <span className="f6 black-30 ttc">
              {this.props.work_status.replace(/[_]/g, ' ')}
            </span>
          </div>
        </div>
        {this.state.expanded && (
          <ExpandedRow
            {...this.props}
            onToggleAddIssue={this.props.onToggleAddIssue}
            onClickStatus={this.onClickStatus}
            work_status={this.props.work_status}
          />
        )}
      </div>
    )
  }
}

export default TaskRow
