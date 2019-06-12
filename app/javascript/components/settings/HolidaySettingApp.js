import 'babel-polyfill'
import React, { lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { toast } from '../utils/toast'
import classNames from 'classnames'
import Calendar from 'react-calendar'
import { startOfYear, endOfYear, addMonths } from 'date-fns'
import { SlidePanel } from '../utils'
import HolidayForm from './HolidayForm'

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

.hide{
  visibility: hidden;
}
`

@observer
class HolidaySettingApp extends React.Component {
  state = {
    editingUser: {},
    showHolidayForm: false,
    dates: [new Date(), new Date(2019, 4, 21), new Date(2019, 4, 22)]
  }

  async componentDidMount() {}

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
    const { showHolidayForm, dates } = this.state
    // const tileContent = ({ date, view }) => view === 'month' && dates.includes(date) ? <i className="dot"></i> : null;
    const tileContent = ({ date, view }) =>
      view === 'month' ? (
        <i
          className={classNames('dot center', {
            hide: !dates.some(d => +d === +date)
          })}
        />
      ) : null
    // view === 'month' ? <i
    //   className={classNames('dot center', {
    //     'hide': !dates.some(d => +d === +date)
    //   })}
    // /> : null

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
        <SlidePanel
          width="500px"
          show={showHolidayForm}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <HolidayForm
                ref={form => (this.holidayForm = form)}
                onClose={() => this.setState({ showHolidayForm: false })}
                onSave={users => {
                  this.setState({ showHolidayForm: false })
                  // TaskStore.editAssignedUsers(
                  //   batchId,
                  //   this.state.taskSelected,
                  //   users
                  // )
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
