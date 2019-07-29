import React from 'react'
import { observer } from 'mobx-react'
import { FacilityDashboardWidget } from '../utils'
import FacilityOverview from './FacilityOverview'
import DashboardRoomsCapacity from './DashboardRoomsCapacity'
import DashboardDonutChart from './DashboardDonutChart'
import DashboardRoomDetails from './DashboardRoomDetails'
import FacilityDashboardStore from './FacilityDashboardStore'

@observer
class FacilityDashboardApp extends React.Component {
  constructor(props) {
    super(props)
    FacilityDashboardStore.loadFacilityOverview(this.props.currentFacilityId)
  }
  render() {
    return (
      <React.Fragment>
        <div className="pa4">
          <FacilityOverview facility_id={this.props.currentFacilityId} />

          <div className="flex pv4">
            <div className="ba b--light-gray pa3 bg-white br2">
              <DashboardRoomsCapacity
                facility_id={this.props.currentFacilityId}
              />
              <div className="flex justify-between">
                <div className="w-50">
                  <DashboardDonutChart
                    facility_id={this.props.currentFacilityId}
                  />
                </div>
                <div className="w-50">
                  <DashboardRoomDetails
                    facility_id={this.props.currentFacilityId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default FacilityDashboardApp
