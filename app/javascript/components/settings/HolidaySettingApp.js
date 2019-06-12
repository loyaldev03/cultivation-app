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
`

@observer
class HolidaySettingApp extends React.Component {
  state = {
    editingUser: {},
    showAssignResourcePanel: false
  }

  async componentDidMount() {}

  openSidebar = () => {
    if (!window.editorSidebar || !window.editorSidebar.sidebarNode) {
      window.editorSidebar.setup(document.querySelector('[data-role=sidebar]'))
    }
    window.editorSidebar.open({ width: '700px' })
  }

  closeSidebar = () => {
    this.setState({
      editingUser: {}
    })
    window.editorSidebar.close()
  }

  render() {
    const { showAssignResourcePanel } = this.state
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
        />
      )
      date = addMonths(date, 1)
    }
    return (
      <React.Fragment>
        <style>{styles}</style>
        <SlidePanel
          width="600px"
          show={showAssignResourcePanel}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <AssignResourceForm
                ref={form => (this.assignResouceForm = form)}
                facilityId={this.props.batch.facility_id}
                onClose={() =>
                  this.setState({ showAssignResourcePanel: false })
                }
                onSave={users => {
                  this.setState({ showAssignResourcePanel: false })
                  TaskStore.editAssignedUsers(
                    batchId,
                    this.state.taskSelected,
                    users
                  )
                }}
                facilityId={this.props.batch.facility_id}
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
