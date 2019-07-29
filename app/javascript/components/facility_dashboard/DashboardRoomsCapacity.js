import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { FacilityRoomCapacityWidget } from '../utils'
import DashboardDonutChart from './DashboardDonutChart'
import DashboardRoomDetails from './DashboardRoomDetails'

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
        <div className="flex justify-between">
          <div className="w-50">
            <DashboardDonutChart facility_id={this.props.currentFacilityId} />
          </div>
          <div className="w-50">
            <DashboardRoomDetails facility_id={this.props.currentFacilityId} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default DashboardRoomsCapacity
