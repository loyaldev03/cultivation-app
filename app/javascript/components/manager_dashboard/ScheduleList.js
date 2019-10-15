import React from 'react'
import { formatYDM, Loading } from '../utils'
import Calendar from 'react-calendar/dist/entry.nostyle'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'

@observer
export default class ScheduleList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }

  onChangeDate = date => {
    this.setState({ date: date })
  }

  changeActiveDate = async date => {
    let start_of_month = startOfMonth(date.activeStartDate)
    let end_of_month = endOfMonth(date.activeStartDate)
    await ChartStore.loadScheduleDateRange(
      format(start_of_month, 'YYYY-MM-DD'),
      format(end_of_month, 'YYYY-MM-DD')
    )
    this.setState({ date: date.activeStartDate })
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex">
          <div className="w-50">
            <h1 className="f5 fw6 dark-grey">Schedule</h1>
          </div>
          <div className="w-50">
            <h1 className="f5 fw6 dark-grey" style={{ marginLeft: 110 + 'px' }}>
              {format(this.state.date, 'DD MMMM YYYY')}
            </h1>
          </div>
        </div>
        <div className="flex">
          <div className="w-60">
            <div className="schedule-calendar">
              <Calendar
                onChange={this.onChangeDate}
                value={this.state.date}
                onActiveDateChange={this.changeActiveDate}
                view="month"
                minDetail="month"
                tileContent={({ date, view }) => (
                  <div
                    className="react-calendar__tile__content"
                    onClick={e => ChartStore.loadScheduleList(formatYDM(date))}
                  >
                    {date.getDate()}
                    {ChartStore.schedule_date_range.findIndex(
                      x => x.date === formatYDM(date) && x.numberOfTasks > 0
                    ) >= 0 && <div className="dot"> </div>}
                  </div>
                )}
                showNavigation={true}
              />
            </div>
          </div>
          <div className="w-40">
            <div className="overflow-y-scroll" style={{ height: 320 + 'px' }}>
              {ChartStore.schedule_list_loaded ? (
                ChartStore.schedule_list.map((e, i) => (
                  <div className="flex pa3" key={i}>
                    <div className="w-50 f6 fw6 ttc dark-grey">
                      {e.batch_name}
                    </div>
                    <div className=" w-50 f6 fw6 grey">{e.name}</div>
                  </div>
                ))
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
