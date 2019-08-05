import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { PeopleCapacityPlanningWidget, PeopleUserListWidget } from '../utils'

@observer
class CapacityPlanning extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Capacity Planning</h1>
        </div> */}
        <div className="ba b--light-gray pa3 bg-white br2 mr3">
          <img src={PeopleCapacityPlanningWidget} />
          <img src={PeopleUserListWidget} />
        </div>
      </React.Fragment>
    )
  }
}

export default CapacityPlanning
