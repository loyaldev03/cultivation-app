import React from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import styled from 'styled-components'
import { toJS } from 'mobx'

import { addNotes } from '../actions/taskActions'
import DailyTasksStore from '../store/DailyTasksStore'
import { isEmptyString } from '../../utils/StringHelper'



@observer
class EditPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_tab: 0
    };

    this.changeTabs = this.changeTabs.bind(this);
  }

  changeTabs(index) {
    this.setState({selected_tab: index});
  }

  render () {
    const styles = `
      .active{
        font-weight: bold;
        display: inline-block;
        position: relative;
        border-bottom: 3px solid var(--orange);
        padding-bottom: 16px;
      }

      .active:after {
        position: absolute;
        content: '';
        width: 70%;
        transform: translateX(-50%);
        bottom: -15px;
        left: 50%;
      }
    `

    const tabs = [
      <LogsAndActivities {...this.props} />,
      <MaterialUsed {...this.props} />,
      <Issues {...this.props} />
    ]

    const classWhenActive = (index, className) => (
      this.state.selected_tab == index ? className : ''
    )

    return (<div>
      <div className="ph3 pv2 mb3 bb b--light-gray flex items-center" style={{ height: '51px' }}>
        <style>{styles}</style>
        <div className="mt3 flex w-100 tc">
          <div className={`w-30 ph2 pointer dim ${classWhenActive(0, 'active')}`} onClick={() => this.changeTabs(0)}>Logs & Activities</div>
          <div className={`w-40 ph2 pointer dim ${classWhenActive(1, 'active')}`} onClick={() => this.changeTabs(1)}>Material Used & Wastes</div>
          <div className={`w-20 ph2 pointer dim ${classWhenActive(2, 'active')}`} onClick={() => this.changeTabs(2)}>Issues</div>
        </div>
        <div className="pointer" onClick={() => { DailyTasksStore.editingPanel = null }}>
          <i className="material-icons mid-gray md-18">close</i>
        </div>
      </div>

      <ScrollableContainer className="f5 pv2 ph4">
        {tabs[this.state.selected_tab]}
      </ScrollableContainer>
    </div>)
  }
}

@observer
class LogsAndActivities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      log_value: ''
    };

    this.handleLogChange = this.handleLogChange.bind(this);
    this.handleLogSubmit = this.handleLogSubmit.bind(this);
  }

  handleLogChange(event) {
    this.setState({log_value: event.target.value});
  }

  handleLogSubmit(event) {
    event.preventDefault();
    if (isEmptyString(this.state.log_value)) {
      return false;
    }
    const { dailyTask } = this.props
    addNotes(dailyTask, this.state.log_value);
    this.setState({log_value: ''});
  }

  render(){
    const { dailyTask } = this.props
    const task = dailyTask.attributes.task

    const timeFormat = (datetime) => (
      moment(datetime).format('hh:mm A')
    )
    const dateFormat = (datetime) => (
      moment(datetime).format('MMMM D, YYYY')
    )

    return (<div className="w-100 lh-copy black-60 f6">
      <div className="mb3">
        <div className="b ttu">Materials Used</div>
        {task.attributes.items.map((item, i) => (
          <li className="ml3" key={i}><span className="b">{item.name}:</span> {item.quantity} {item.uom}</li>
        ))}
      </div>

      <div className="mb3">
        <div className="b ttu">Activity Log</div>
        {dailyTask.attributes.time_logs.map((log, i) => (
          <li className="ml3" key={i}>Started at {timeFormat(log.start_time)} {log.end_time && `and ended at ${timeFormat(log.end_time)}`}</li>
        ))}
      </div>

      <div className="mb3">
        <div className="b ttu">Notes</div>
        {dailyTask.attributes.notes.map((note, i) => (
          <div className="mv2" key={i}>
            <i className="material-icons mid-gray md-18 fl">today</i>
            <div className="v-top fl ml2">
              <strong>{dateFormat(note.created_at)}</strong> {timeFormat(note.created_at)}
            </div>

            <div className="cl">{note.notes}</div>
          </div>
        ))}

        <form className="mt3" onSubmit={this.handleLogSubmit}>
          <textarea className="w-100" placeholder="Write an update ..." rows="5" value={this.state.log_value} onChange={this.handleLogChange}></textarea>
          <input className="ttu fr pointer pv3 ph5 bg-orange button--font white bn box--br3" type="submit" value="Save" />
        </form>
      </div>
    </div>)
  }
}

@observer
class MaterialUsed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }

  render () {
    return(<div className="w-100">

    </div>)
  }
}

const Issues = () => (<div>Issues ...</div>)

const ScrollableContainer = styled.div`
  overflow: auto;
  height: calc(100vh - 80px);
`

export default EditPanel