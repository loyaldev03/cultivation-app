import React from 'react'
import { observer } from 'mobx-react'
import Calendar from 'react-calendar/dist/entry.nostyle'

@observer
class DashboardCalendarApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = { date: new Date() }
  }

  onChange = date => this.setState({ date })

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-center mt3 w-100 schedule-calendar">
          <Calendar
            onChange={this.onChange}
            minDetail="month"
            value={this.state.date}
            tileContent={({ date, view }) => (
              <div className="react-calendar__tile__content">
                {date.getDate()}
              </div>
            )}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default DashboardCalendarApp
