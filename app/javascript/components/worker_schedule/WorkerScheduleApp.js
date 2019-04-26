import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import Calendar from 'react-calendar'
import WeeklyCalendar from './ConceptWeeklyCalendar'
import MonthlyCalendar from './MonthlyCalendar'
import workerScheduleStore from './stores/WorkerScheduleStore'
import MiniMonthlyCalendar from './MiniMonthlyCalendar'
@observer
class WorkerScheduleApp extends React.Component {
  state = {
    date: new Date(),
    choice: 'week',
    dateSelected: null,
    taskList: null
  }

  onChangeCalendar = duration => {
    console.log(duration)
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
    const { choice, taskList, dateSelected } = this.state
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
          <div className="flex justify-between">
            <div className="flex flex-column w-40 grey ">
              <Calendar
                onChange={this.onChange}
                value={this.state.date}
                onClickDay={this.getDayTask}
              />
              {/* <MiniMonthlyCalendar/> */}
              <div>
                <div className="flex justify-between f3 lh-copy b dark-gray mb3 mt2">
                  <span>Task</span>
                  <span>{dateSelected}</span>
                </div>
                {taskList &&
                  taskList.map(task => (
                    <div className="b" key={task.id}>
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
            {choice == 'week' && (
              <WeeklyCalendar
                appointments={{
                  lunes: [
                    {
                      nombre: 'Gustavo',
                      hora_inicio: '08:00',
                      hora_termino: '09:00'
                    },
                    {
                      nombre: 'Felipe',
                      hora_inicio: '09:30',
                      hora_termino: '11:00'
                    },
                    {
                      nombre: 'Cony',
                      hora_inicio: '18:00',
                      hora_termino: '18:30'
                    }
                  ],
                  martes: [],
                  miercoles: [
                    {
                      nombre: 'Nicole',
                      hora_inicio: '11:30',
                      hora_termino: '14:00'
                    }
                  ],
                  jueves: [
                    {
                      nombre: 'Alejandro',
                      hora_inicio: '00:00',
                      hora_termino: '00:00'
                    }
                  ],
                  viernes: []
                }}
              />
            )}
            {choice == 'month' && <MonthlyCalendar />}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default WorkerScheduleApp
