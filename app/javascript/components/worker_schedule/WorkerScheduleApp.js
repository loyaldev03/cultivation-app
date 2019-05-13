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
  formatMonthAndYear
} from '../utils'

@observer
class WorkerScheduleApp extends React.Component {
  state = {
    date: new Date(),
    choice: 'Week',
    dateSelected: null,
    taskList: null,
    weeklyTask: [],
    isWeeklyLoaded: false
  }
  componentDidMount = async () => {
    workerScheduleStore
    var curr = new Date() // get current date
    var first = curr.getDate() - curr.getDay() + 1 // First day is the day of the month - the day of the week
    var last = first + 6
    let monthString = formatMonthAndYear(curr)
    let task = await workerScheduleStore.getTaskByMonth(
      formatMonthAndYear(curr),
      curr
    )
    // console.log(task)
    let weeklyTask = await workerScheduleStore.getTaskByWeekArr(
      monthString + first,
      monthString + last
    )
    this.setState({ weeklyTask, isWeeklyLoaded: true })
  }
  onChangeCalendar = duration => {
    // console.log(duration)
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
  onChange = date => this.setState({ date })

  render() {
    const {
      choice,
      taskList,
      dateSelected,
      weeklyTask,
      isWeeklyLoaded
    } = this.state
    const duration = ['Week', 'Month']
    return (
      <React.Fragment>
        <div className="flex flex-column mt3 ba b--light-gray pa3 bg-white">
          <div className="flex justify-between grey b">
            <span>Working Calendar</span>
            <span>
              <select
                value={this.choice}
                className="b--white grey b"
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
            <div className="flex flex-column grey ">
              {monthStartDate}
              <Calendar
                className="schedule-calendar"
                activeStartDate={monthStartDate(formatDate(new Date()))}
                onChange={this.onChange}
                value={this.state.date}
                onClickDay={this.getDayTask}
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
                    {workerScheduleStore.taskData.findIndex(
                      x => x.date === formatYDM(date) && x.numberOfTasks > 0
                    ) >= 0 && <div className="dot"> </div>}
                  </div>
                )}
                showNavigation={true}
              />
              {/* <MiniMonthlyCalendar/> */}

              <div>
                <div className="flex justify-between f6 lh-copy b dark-gray mb3 mt4">
                  <span>Task</span>
                  <span>{dateSelected}</span>
                </div>
                {taskList &&
                  taskList.map(task => (
                    <div className="" key={task.id}>
                      <div className="flex justify-between grey">
                        <span>
                          {task.attributes.name}
                          <div className="f6">
                            {task.attributes.location_name}
                          </div>
                        </span>
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
            <div className="w-20" />
            {choice == 'Week' && (
              <WeeklyCalendar
                weeklyTask={weeklyTask}
                isWeeklyLoaded={isWeeklyLoaded}
              />
            )}
            {choice == 'Month' && <MonthlyCalendar />}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default WorkerScheduleApp
