import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import Calendar from 'react-calendar'
import WeeklyCalendar from './ConceptWeeklyCalendar'
import MonthlyCalendar from './MonthlyCalendar'

@observer
class WorkerScheduleApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      choice: 'week'
    }
  }

  onChangeCalendar = duration => {
    console.log(duration)
    this.setState({ choice: duration })
  }

  onChange = date => this.setState({ date })

  render() {
    const { choice } = this.state
    const duration = ['week', 'month']
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
            <div className="flex flex-column w-30 grey ">
              <Calendar onChange={this.onChange} value={this.state.date} />
              <div>
                <h3>Task List</h3>
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
