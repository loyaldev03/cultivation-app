import React, { lazy, Suspense } from 'react'
import {
  dateToMonthOption,
  monthOptionAdd,
  monthOptionToString,
  monthStartDate,
  SlidePanelHeader,
  SlidePanelFooter
} from '../utils'
// const Calendar = lazy(() => import('react-calendar/dist/entry.nostyle'))
import Calendar from 'react-calendar/dist/entry.nostyle'

export default class MiniMonthlyCalendar extends React.Component {
  render() {
    let date = new Date()
    let searchMonth = '04-2019'
    let totalDuration = 11
    return (
      <div className="miniCalendar">
        <Calendar
          showNavigation={false}
          activeStartDate={monthStartDate(searchMonth)}
          tileContent={({ date, view }) => (
            <CapacityTile startDate={date} duration={totalDuration} />
          )}
        />
      </div>
    )
  }
}
class CapacityTile extends React.PureComponent {
  render() {
    const { startDate, duration } = this.props
    console.log(this.props)
    return <div className="">hehe</div>
  }
}
