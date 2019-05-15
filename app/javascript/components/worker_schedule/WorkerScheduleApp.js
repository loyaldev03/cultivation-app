import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import Calendar from 'react-calendar/dist/entry.nostyle'

import WeeklyCalendar from './ConceptWeeklyCalendar'
import MonthlyCalendar from './MonthlyCalendar'
import workerScheduleStore from './stores/WorkerScheduleStore'
import MiniMonthlyCalendar from './MiniMonthlyCalendar'
import {
  formatYDM,
  monthStartDate,
  formatDate,
  formatShortWeekday,
  formatMonthAndYear
} from '../utils'

@observer
class WorkerScheduleApp extends React.Component {
  state = {
    date: new Date(),
    choice: 'Week',
    dateSelected: null,
    monthMarking:[],
    taskList: null,
    weeklyTask: [],
    isWeeklyLoaded: false
  }
  componentDidMount = async () => {
    workerScheduleStore
    var curr = new Date() // get current date
    var first = curr.getDate() - curr.getDay() + 1 // First day is the day of the month - the day of the week
    var last = first + 6
    let monthString = formatMonthAndYear(curr);
    let date = new Date();
    const months = [
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
    let task = await workerScheduleStore.getTaskByMonth(
      formatMonthAndYear(curr),
      curr
    )
    let weeklyTask = await workerScheduleStore.getTaskByWeekArr(
      monthString + first,
      monthString + last
    )
    let dateSelected = `${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`
    const taskList = await workerScheduleStore.getTaskByDate(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    )
    this.setState({ weeklyTask, isWeeklyLoaded: true,taskList, monthMarking:task, dateSelected })
  }
  onChangeCalendar = duration => {
    this.setState({ choice: duration })
  }
  getDayTask = async date => {
    const months = [
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
    let dateSelected = `${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`
    const taskList = await workerScheduleStore.getTaskByDate(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    )
    this.setState({ taskList, dateSelected })
  }
  onChange = date => {
    this.setState({ date })
  }

  changeDate = async date =>{
    date = date.activeStartDate
    const taskList = await workerScheduleStore.getTaskByMonth(
      formatMonthAndYear(date),
      date
    )
    this.setState({ monthMarking:taskList})
  }
  render() {
    const {
      choice,
      taskList,
      dateSelected,
      monthMarking,
      weeklyTask,
      isWeeklyLoaded
    } = this.state
    const duration = ['Week', 'Month']
    return (
      <div className="flex flex-column mt3 ba b--light-gray pa3 bg-white">
        <div className="flex justify-between items-center dark-gray b">
          <span>Working Calendar</span>
          <span>
            <select
              value={this.choice}
              className="b--white dark-gray b"
              onChange={e => this.onChangeCalendar(e.target.value)}
              style={{ minWidth: 67 + 'px' }}
            >
              {duration &&
                duration.map((y, index) => (
                  <option key={index} value={y}>
                    {y}
                  </option>
                ))}
            </select>
          </span>
        </div>
        <div className="flex ">
          <div className="flex flex-column grey w-30">
            <Calendar
              className="schedule-calendar"
              activeStartDate={monthStartDate(formatDate(new Date()))}
              onChange={this.onChange}
              value={this.state.date}
              onClickDay={this.getDayTask}
              onActiveDateChange={this.changeDate}
              view="month"
              minDetail="month"
              formatShortWeekday={(locale, date) => formatShortWeekday(date)}
              tileContent={({ date, view }) => (
                <div
                  className="react-calendar__tile__content"
                  style={{
                    background: `${date.getDate() == 21 && '#f69d63'}`,
                    color: `${date.getDate() == 21 && '#ff6300'}`
                  }}
                  onClick={e => console.log(formatYDM(date))}
                >
                  {date.getDate()}
                  {monthMarking.findIndex(
                    x => x.date === formatYDM(date) && x.numberOfTasks > 0
                  ) >= 0 && <div className="dot"> </div>}
                </div>
              )}
              showNavigation={true}
            />
            {/* <MiniMonthlyCalendar/> */}

            <div>
              <div className="flex items-center justify-between lh-copy dark-gray mb3 mt4">
                <span className="f4 fw6">Tasks</span>
                <span className="f5 fw6">{dateSelected}</span>
              </div>
              {taskList &&
                taskList.map(task => (
                  <div className="pb3" key={task.id}>
                    <div className="flex justify-between grey pb3">
                      <div>
                        <span className="fw6 f5">{task.attributes.name}</span>
                        <span className="f5 pt2 db">
                          {task.attributes.location_name}
                        </span>
                      </div>
                      <span>
                        {task.attributes.work_status === 'not_started' && (
                          <i className="orange material-icons pointer md-36 dim">
                            play_circle_filled
                          </i>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {choice == 'Week' && (
            <WeeklyCalendar
              weeklyTask={weeklyTask}
              isWeeklyLoaded={isWeeklyLoaded}
            />
          )}
          {choice == 'Month' && <MonthlyCalendar />}
        </div>
      </div>
    )
  }
}

export default WorkerScheduleApp
