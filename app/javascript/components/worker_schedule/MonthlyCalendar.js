import React, { lazy, Suspense } from 'react'
import workerScheduleStore from './stores/WorkerScheduleStore'
import {
  monthOptionToString,
  monthStartDate,
  formatYDM,
  dateToMonthOption
} from '../utils'
import TaskPopper from './TaskPopper'
const Calendar = lazy(() => import('react-calendar/dist/entry.nostyle'))

export default class MonthlyCalendar extends React.Component {
  render() {
    let date = new Date()
    let searchMonth = dateToMonthOption(date)
    return (
      <div className="pl5 pr4">
        <div className="month-calendar-title">
          {monthOptionToString(searchMonth)}
        </div>
        <Suspense fallback={<div />}>
          <Calendar
            style={{ width: '100%' }}
            className="schedule-month-calendar"
            showNavigation={false}
            activeStartDate={monthStartDate(searchMonth)}
            tileContent={({ date, view }) => (
              <CapacityTile date={date} duration={0} />
            )}
          />
        </Suspense>
      </div>
    )
  }
}
class CapacityTile extends React.PureComponent {
  state = {
    dayTask: [],
    duration: null
  }
  componentDidMount = async () => {
    let { date } = this.props
    let dayTask = await workerScheduleStore.getTaskByDate(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    )
    let duration = await workerScheduleStore.getTaskByDay(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    )
    this.setState({ dayTask, duration })
  }
  render() {
    const { dayTask, duration } = this.state
    const { date } = this.props
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
              fontSize: '.6em',
              fontWeight: 600,
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {duration[0] && duration[0].start_time && duration[0].end_time && (
              <div className="mt3 b mb0">
                {duration[0].start_time} - {duration[0].end_time}
              </div>
            )}
            {/* <span className="b">{dayTask.length} Tasks</span> */}
            <TaskPopper date={formatYDM(date)} numberOfTask={dayTask.length} />
          </div>
        ) : (
          ' '
        )}
      </div>
    )
  }
}
