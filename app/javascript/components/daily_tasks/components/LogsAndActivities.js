import React from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'

import { isEmptyString } from '../../utils/StringHelper'
import { addNotes } from '../actions/taskActions'

@observer
class LogsAndActivities extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      log_value: ''
    }

    this.handleLogChange = this.handleLogChange.bind(this)
    this.handleLogSubmit = this.handleLogSubmit.bind(this)
  }

  handleLogChange(event) {
    this.setState({ log_value: event.target.value })
  }

  handleLogSubmit(event) {
    event.preventDefault()
    if (isEmptyString(this.state.log_value)) {
      return false
    }
    const { dailyTask } = this.props
    addNotes(dailyTask, this.state.log_value)
    this.setState({ log_value: '' })
  }

  render() {
    const { dailyTask } = this.props
    const task = dailyTask.attributes.task

    const timeFormat = datetime => moment(datetime).format('hh:mm A')
    const dateFormat = datetime => moment(datetime).format('MMMM D, YYYY')

    return (
      <div className="w-100 lh-copy black-60 f6">
        <div className="mb3">
          <div className="b ttu">Materials Used</div>
          {task.attributes.items.map((item, i) => (
            <li className="ml3" key={i}>
              <span className="b">{item.name}:</span> {item.quantity} {item.uom}
            </li>
          ))}
        </div>

        <div className="mb3">
          <div className="b ttu">Activity Log</div>
          {dailyTask.attributes.time_logs.map((log, i) => (
            <li className="ml3" key={i}>
              Started at {timeFormat(log.start_time)}{' '}
              {log.end_time && `and ended at ${timeFormat(log.end_time)}`}
            </li>
          ))}
        </div>

        <div className="mb3">
          <div className="b ttu">Notes</div>
          {dailyTask.attributes.notes.map((note, i) => (
            <div className="mv2" key={i}>
              <i className="material-icons mid-gray md-18 fl">today</i>
              <div className="v-top fl ml2">
                <strong>{dateFormat(note.created_at)}</strong>{' '}
                {timeFormat(note.created_at)}
              </div>

              <div className="cl">{note.notes}</div>
            </div>
          ))}

          <form className="mt3" onSubmit={this.handleLogSubmit}>
            <textarea
              className="w-100"
              placeholder="Write an update ..."
              rows="5"
              value={this.state.log_value}
              onChange={this.handleLogChange}
            />
            <input
              className="ttu fr pointer pv3 ph5 bg-orange button--font white bn box--br3"
              type="submit"
              value="Save"
            />
          </form>
        </div>
      </div>
    )
  }
}

export default LogsAndActivities