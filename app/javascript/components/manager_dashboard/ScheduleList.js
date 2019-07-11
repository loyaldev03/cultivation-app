import React from 'react'
import { TempHomeSchedule, formatYDM } from '../utils'
import Calendar from 'react-calendar/dist/entry.nostyle'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'

@observer
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }

  onChangeDate = (date) => {
    this.setState({date: date})
  }

  changeActiveDate = async (date) => {
    let start_of_month = startOfMonth(date.activeStartDate)
    let end_of_month = endOfMonth(date.activeStartDate)
    await ChartStore.loadScheduleDateRange(format(start_of_month, 'YYYY-MM-DD'), format(end_of_month, 'YYYY-MM-DD'))
    this.setState({ date: date.activeStartDate })
  }

  render() {
    return (
      <React.Fragment>
        {/* <img src={TempHomeSchedule} /> */}
        <div className="flex">
          <div className="w-50">
            <h1 className="f4 ml3">Schedule</h1>
          </div>
          <div className="w-50">
            <h1 className="f4" style={{marginLeft: 110+'px'}}>{format(this.state.date, 'DD MMMM YYYY')}</h1>
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
                    onClick={e => ChartStore.loadScheduleList((formatYDM(date)))}
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
            <div className="overflow-y-scroll" style={{ height: 280 + 'px' }}>
              {ChartStore.schedule_list_loaded ? 
                ChartStore.schedule_list.map(e=>(
                  <div className="flex pa3">
                    <div className="w-50 f6 fw6 ttc">
                      {e.batch_name}
                    </div>
                    <div className=" w-50 f6 fw6 grey">
                      {e.name}
                    </div>
                  </div>
                ))
                :
                <div>Loading ...</div>
              }
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
