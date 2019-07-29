import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { FacilityRoomCapacityWidget } from '../utils'

@observer
class DashboardRoomsCapacity extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Rooms Capacity</h1>
        </div> */}
        <img src={FacilityRoomCapacityWidget} />
      </React.Fragment>
    )
  }
}

export default DashboardRoomsCapacity
