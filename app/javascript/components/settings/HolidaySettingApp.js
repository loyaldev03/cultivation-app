import 'babel-polyfill'
import React, { lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { toast } from '../utils/toast'
import classNames from 'classnames'
import Calendar from 'react-calendar/dist/entry.nostyle'
import { startOfYear, endOfYear, addMonths } from 'date-fns'
import { SlidePanel } from '../utils'
import HolidayForm from './HolidayForm'
import HolidayStore from './HolidayStore'
const styles = `
.react-calendar, .react-calendar *, .react-calendar *:before, .react-calendar *:after {
}
.react-calendar__tile--active {
    background: none;
    color: initial;
}
.dot{
  height: 5px;
  width: 5px;
  background-color: var(--orange);
  border-radius: 50%;
  display: flex;
  bottom: 0;
  right: 43%;
}

.hide-holiday{
  visibility: hidden;
}
.react-calendar__tile--active:enabled:hover, .react-calendar__tile--active:enabled:focus {
    background: #1087ff;
    color: white;
}

`

@observer
class HolidaySettingApp extends React.Component {
  state = {
    editingUser: {},
    showHolidayForm: false,
    dates: [
      { title: 'today', date: new Date() },
      { title: 'Birthday Agong', date: new Date(2019, 4, 21) },
      { title: 'Testing Holiday', date: new Date(2019, 4, 22) }
    ]
  }

  async componentDidMount() {
    HolidayStore.loadHolidays(2019)
  }

  openSidebar = () => {
    if (!window.editorSidebar || !window.editorSidebar.sidebarNode) {
      window.editorSidebar.setup(document.querySelector('[data-role=sidebar]'))
    }
    window.editorSidebar.open({ width: '500px' })
  }

  closeSidebar = () => {
    this.setState({
      editingUser: {}
    })
    window.editorSidebar.close()
  }

  handleShowHolidayForm = date => {
    console.log(date)
    this.holidayForm.setDate(date)
    this.setState({
      showHolidayForm: !this.state.showHolidayForm
    })
  }

  render() {
    const dates = HolidayStore.getHolidays()
    const { showHolidayForm } = this.state
    const tileContent = ({ date, view }) =>
      view === 'month' ? (
        <i
          className={classNames('dot center', {
            'hide-holiday': !dates.some(d => +d.date === +date)
          })}
        />
      ) : null

    let row1 = []
    let date = startOfYear(new Date())
    for (let i = 0; i < 4; i++) {
      row1.push(
        <Calendar
          key={i}
          value={date}
          showNeighboringMonth={false}
          prevLabel={null}
          nextLabel={null}
          prev2Label={null}
          next2Label={null}
          tileContent={tileContent}
          onChange={this.handleShowHolidayForm}
        />
      )
      date = addMonths(date, 1)
    }
    let row2 = []
    for (let i = 0; i < 4; i++) {
      row2.push(
        <Calendar
          key={i}
          value={date}
          showNeighboringMonth={false}
          prevLabel={null}
          nextLabel={null}
          prev2Label={null}
          next2Label={null}
          tileContent={tileContent}
          onChange={this.handleShowHolidayForm}
        />
      )
      date = addMonths(date, 1)
    }
    let row3 = []
    for (let i = 0; i < 4; i++) {
      row3.push(
        <Calendar
          key={i}
          value={date}
          showNeighboringMonth={false}
          prevLabel={null}
          nextLabel={null}
          prev2Label={null}
          next2Label={null}
          tileContent={tileContent}
          onChange={this.handleShowHolidayForm}
        />
      )
      date = addMonths(date, 1)
    }
    return (
      <React.Fragment>
        <style>{styles}</style>
        <div id="toast" className="toast animated toast--success" />
        <SlidePanel
          width="500px"
          show={showHolidayForm}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <HolidayForm
                ref={form => (this.holidayForm = form)}
                onClose={() => this.setState({ showHolidayForm: false })}
                onSave={holiday => {
                  this.setState({ showHolidayForm: false })
                  HolidayStore.createHoliday(holiday)
                }}
                title={'Holiday'}
              />
            </Suspense>
          )}
        />
        <div className="nowrap overflow-x-auto">
          <div className="flex">{row1}</div>
          <div className="flex">{row2}</div>
          <div className="flex">{row3}</div>
        </div>
      </React.Fragment>
    )
  }
}

export default HolidaySettingApp
