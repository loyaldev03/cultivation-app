import React, { lazy, Suspense } from 'react'
import workerScheduleStore from './stores/WorkerScheduleStore'
import {
  dateToMonthOption,
  monthOptionAdd,
  monthOptionToString,
  monthStartDate,
  SlidePanelHeader,
  SlidePanelFooter
} from '../utils'
const Calendar = lazy(() => import('react-calendar/dist/entry.nostyle'))
class CalendarTitleBar extends React.PureComponent {
  render() {
    const { onPrev, onNext, month } = this.props
    return (
      <div className="month-calendar-title">{monthOptionToString(month)}</div>
    )
  }
}

export default class MonthlyCalendar extends React.Component {
  render() {
    let date = new Date(),
      totalDuration = 140
    let searchMonth = '05-2019'
    return (
      <div className="ph2">
        <CalendarTitleBar month={searchMonth} />
        <Suspense fallback={<div />}>
          <Calendar
            style={{ width: '100%' }}
            className="schedule-month-calendar"
            showNavigation={false}
            activeStartDate={monthStartDate(searchMonth)}
            tileContent={({ date, view }) => (
              <CapacityTile date={date} duration={totalDuration} />
            )}
          />
        </Suspense>
      </div>
    )
  }
}
class CapacityTile extends React.PureComponent {
  state = {
    dayTask: []
  }
  componentDidMount = async () => {
    let { date } = this.props
    let dayTask = await workerScheduleStore.getTaskByDate(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    )
    this.setState({ dayTask })
  }
  render() {
    const { dayTask } = this.state
    const { date, duration } = this.props
    return (
      <div className="white f6 lh-copy day-tile">
        <span
          className={`${dayTask.length > 0 ? 'white' : 'gray'} date-indicator`}
        >
          {date.getDate()}
        </span>
        {dayTask.length > 0 ? (
          <div
            className="bg-orange white pa1"
            style={{
              fontSize: '.5em',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {dayTask.length} Tasks
          </div>
        ) : (
          ' s'
        )}
      </div>
    )
  }
}
