import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { PeopleReminderWidget } from '../utils'

@observer
class ReminderWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Overall Info</h1>
        </div> */}
        <img src={PeopleReminderWidget} />
      </React.Fragment>
    )
  }
}

export default ReminderWidget
