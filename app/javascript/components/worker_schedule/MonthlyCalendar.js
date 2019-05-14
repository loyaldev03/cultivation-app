import React, { lazy, Suspense } from 'react'
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
      <div className="availabilty-calendar-title">
        <button
          onClick={onPrev}
          className="fl fw4 ph2 br-100 pointer bg-white ml2"
        >
          &#171;
        </button>
        {monthOptionToString(month)}
        <button
          onClick={onNext}
          className="fr fw4 ph2 br-100 pointer bg-white mr2"
        >
          &#187;
        </button>
      </div>
    )
  }
}

export default class MonthlyCalendar extends React.Component {
  render() {
    let date = new Date(),
      totalDuration = 140
    let searchMonth = '02-2019'
    return (
      <div className="w-60 ph2">
        <CalendarTitleBar
          month={searchMonth}
          onPrev={e => this.onSearch(monthOptionAdd(searchMonth, -1))}
          onNext={e => this.onSearch(monthOptionAdd(searchMonth, 1))}
        />
        <Suspense fallback={<div />}>
          <Calendar
            className="availabilty-calendar-title"
            style={{ width: '100%' }}
            showNavigation={false}
            activeStartDate={monthStartDate(searchMonth)}
            tileContent={({ date, view }) => (
              <CapacityTile startDate={date} duration={totalDuration} />
            )}
          />
        </Suspense>
      </div>
    )
  }
}
class CapacityTile extends React.PureComponent {
  render() {
    const { startDate, duration } = this.props
    return <span className="react-calendar__tile__content" />
  }
}
