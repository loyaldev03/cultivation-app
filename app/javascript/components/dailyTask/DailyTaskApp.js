import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import { SlidePanel } from '../utils/'
import BatchedDailyTasks from './components/BatchedDailyTasks'
import loadDailyTasks from './actions/loadDailyTasks'
import dailyTasksStore from './stores/DailyTasksStore'

const tasks = [
  {
    id: 1,
    wbs: '1.1',
    task: 'Add nutrient',
    location: 'Clone Room A',
    status: 'not started',
    issueCount: 0
  },
  {
    id: 2,
    wbs: '2.1',
    task: 'Clean',
    location: 'Clone Room A',
    status: 'not started',
    issueCount: 2
  }
]

@observer
class DailyTaskApp extends React.Component {
  state = {
    showAddIssue: false,
    showAddMaterial: false,
    showAddNotes: false,
    currentTaskId: null,
    today_date: Date.now
  }

  componentDidMount() {
    loadDailyTasks()
  }

  onToggleAddIssue = (taskId = null) => {
    console.log('on add issue')
    this.setState({
      showAddIssue: !this.state.showAddIssue,
      currentTaskId: taskId
    })
  }

  onToggleAddMaterial = (taskId = null) => {
    this.setState({
      showAddMaterial: !this.state.showAddMaterial,
      currentTaskId: taskId
    })
  }

  onToggleAddNotes = (taskId = null) => {
    this.setState({
      showAddNotes: !this.state.showAddNotes,
      currentTaskId: taskId
    })
  }

  renderSlidePanel() {
    const { showAddMaterial, showAddIssue, showAddNotes } = this.state
    return (
      <React.Fragment>
        <SlidePanel
          width="600px"
          show={showAddMaterial}
          renderBody={props => (
            <div>
              <h3>Add material here...</h3>
              <a
                href="#"
                onClick={event => {
                  this.onToggleAddMaterial()
                  event.preventDefault()
                }}
              >
                Close
              </a>
            </div>
          )}
        />
        <SlidePanel
          width="600px"
          show={showAddIssue}
          renderBody={props => (
            <div>
              <h3>Add issue here...</h3>
              <a
                href="#"
                onClick={event => {
                  this.onToggleAddIssue()
                  event.preventDefault()
                }}
              >
                Close
              </a>
            </div>
          )}
        />
        <SlidePanel
          width="600px"
          show={showAddNotes}
          renderBody={props => (
            <div>
              <h3>Add notes here...</h3>
              <a
                href="#"
                onClick={event => {
                  this.onToggleAddNotes()
                  event.preventDefault()
                }}
              >
                Close
              </a>
            </div>
          )}
        />
      </React.Fragment>
    )
  }

  getDateToday = () => {
    let date = new Date()
    let h = date.getHours()
    let m = date.getMinutes()
    let s = date.getSeconds()
    let days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    let dayName = days[date.getDay()].substring(0, 3)
    let monthName = monthNames[date.getMonth()].substring(0, 3)
    let dates = `${dayName}, ${date.getDate()} ${monthName} ${date.getFullYear()}`

    return dates
  }

  render() {
    const today_date = this.getDateToday()
    return (
      <React.Fragment>
        <div id="toast" className="toast animated toast--success" />
        <div className="flex items-end justify-start mb3">
          <h1 className="f3 ma0 pa0 black-90 fw6">Today</h1>
          <span className="f6 pv1 ph2 br2 ba b--black-20 black-60 bg-white ml2">
            {this.getDateToday()}
          </span>
        </div>

        {dailyTasksStore.bindable.map(batch => (
          <BatchedDailyTasks
            key={batch.id}
            batchName={batch.name}
            tasks={batch.tasks}
            onToggleAddIssue={this.onToggleAddIssue}
            onToggleAddMaterial={this.onToggleAddMaterial}
            onToggleAddNotes={this.onToggleAddNotes}
          />
        ))}

        {this.renderSlidePanel()}
      </React.Fragment>
    )
  }
}

export default DailyTaskApp
