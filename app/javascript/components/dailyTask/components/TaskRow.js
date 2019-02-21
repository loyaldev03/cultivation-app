import React from 'react'
import {
  wbsWidth,
  taskWidth,
  locationWidth,
  btnWidth,
  statusWidth
} from './TaskTableStyles'
import ExpandedRow from './ExpandedRow'

class TaskRow extends React.Component {
  state = {
    expanded: false,
    status: 'not_started'
  }

  onExpand = event => {
    console.log('expended')
    this.setState({ expanded: !this.state.expanded })
    // event.preventDefault()
  }

  onToggleStart = event => {
    if (this.state.status === 'not_started') {
      this.setState({ status: 'in_progress' })
    } else {
      this.setState({ status: 'not_started' })
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
      />
    )
  }

  renderIssueCount(count) {
    if (count <= 0) {
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
    const { wbs, task, location, status, issueCount } = this.props

    return (
      <React.Fragment>
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
            {this.renderIssueCount(issueCount)}
            <span className="f6 pointer" onClick={this.onExpand}>
              {task}
            </span>
          </div>

          <div
            className="flex items-center justify-center pa2"
            style={locationWidth}
          >
            <span className="f6">{location}</span>
          </div>

          <div className="flex items-center justify-center " style={btnWidth}>
            <span
              className="mr1 material-icons orange pointer pa2"
              style={{ fontSize: '20px' }}
              onClick={this.onToggleStart}
            >
              {this.state.status === 'in_progress' ? 'pause' : 'play_arrow'}
            </span>
          </div>

          <div
            className="flex items-center justify-center pa2"
            style={statusWidth}
          >
            <span className="f6 black-30 ttc">{status}</span>
          </div>
        </div>
        {this.renderExpanded()}
      </React.Fragment>
    )
  }
}

export default TaskRow
