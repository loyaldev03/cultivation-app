import React, { lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import BatchSetupStore from '../../batches_setup/BatchSetupStore'
import { toast } from '../../../utils/toast'
import {
  dateToMonthOption,
  monthOptionAdd,
  monthOptionToString,
  monthStartDate,
  SlidePanelHeader,
  SlidePanelFooter
} from '../../../utils'

const Calendar = lazy(() => import('react-calendar/dist/entry.nostyle'))

@observer
class CultivationCalendar extends React.Component {
  constructor(props) {
    super(props)
    BatchSetupStore.searchMonth = dateToMonthOption(this.props.batchStartDate)
    if (!BatchSetupStore.isReady) {
      this.onSearch(BatchSetupStore.searchMonth)
    }
  }

  onSearch = searchMonth => {
    BatchSetupStore.clearSearch()
    BatchSetupStore.searchMonth = searchMonth
    const { totalDuration, facilityId, phaseDuration } = this.props
    if (this.props.totalDuration > 0) {
      const searchParams = {
        facility_id: facilityId,
        search_month: searchMonth,
        total_duration: totalDuration
      }
      BatchSetupStore.search(searchParams, phaseDuration)
    }
  }

  onDatePick = value => {
    BatchSetupStore.selectedStartDate = value
  }

  onSave = async () => {
    const response = await BatchSetupStore.activateBatch(
      this.props.batchId,
      BatchSetupStore.selectedStartDate
    )
    if (response.errors) {
      const err1 = Object.keys(response.errors)[0]
      toast(response.errors[err1], 'error')
    } else {
      toast('Batch saved successfully', 'success')
      setTimeout(() => window.location.reload(), 1000)
    }
    this.props.onSave()
  }

  render() {
    const { onClose, totalDuration, phaseDuration } = this.props
    const { searchMonth } = BatchSetupStore
    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader onClose={onClose} title="Batch's Start Date" />
        <div className="flex-auto pa2">
          <p className="tc">Select a Start Date for the batch</p>
          {BatchSetupStore.isLoading ? (
            <div style={{ minHeight: '362px' }}>
              <span className="dib pa2">Searching...</span>
            </div>
          ) : (
            <React.Fragment>
              <CalendarTitleBar
                month={searchMonth}
                onPrev={e => this.onSearch(monthOptionAdd(searchMonth, -1))}
                onNext={e => this.onSearch(monthOptionAdd(searchMonth, 1))}
              />
              <Suspense fallback={<div />}>
                <Calendar
                  activeStartDate={monthStartDate(searchMonth)}
                  className="availabilty-calendar"
                  showNavigation={false}
                  onChange={this.onDatePick}
                  tileContent={({ date, view }) => (
                    <CapacityTile startDate={date} duration={totalDuration} />
                  )}
                />
              </Suspense>
            </React.Fragment>
          )}
        </div>
        <SlidePanelFooter onSave={this.onSave} />
      </div>
    )
  }
}

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

class CapacityTile extends React.PureComponent {
  render() {
    const { startDate, duration } = this.props
    return (
      <span className="react-calendar__tile__content">
        {BatchSetupStore.getCapacity(startDate, duration)}
      </span>
    )
  }
}

export default CultivationCalendar
