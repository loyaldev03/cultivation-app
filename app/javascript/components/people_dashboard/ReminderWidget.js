import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { PeopleReminderWidget } from '../utils'
import PeopleDashboardStore from './PeopleDashboardStore'

@observer
class ReminderWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Reminders</h1>
        </div>
        {PeopleDashboardStore.reminder_loaded ? (
          <div>
            <div className="flex">
              <h1 className="f5 fw6 orange dib">{PeopleDashboardStore.data_reminder.time_off_request}</h1>
              <h1 className="f5 fw6 grey dib ml2">Time off Request</h1>
            </div>
            <div className="flex">
              <h1 className="f5 fw6 orange dib">{PeopleDashboardStore.data_reminder.employees_leaving}</h1>
              <h1 className="f5 fw6 grey dib ml2">Employee Leaving This Week</h1>
            </div>
            <div className="flex">
              <h1 className="f5 fw6 orange dib">{PeopleDashboardStore.data_reminder.employees_starting}</h1>
              <h1 className="f5 fw6 grey dib ml2">Employee Starting This Week</h1>
            </div>
          </div>
        ) : ('loading...')}
        
      </React.Fragment>
    )
  }
}

export default ReminderWidget
