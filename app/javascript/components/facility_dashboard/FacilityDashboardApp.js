import React from 'react'
import { observer } from 'mobx-react'
import { FacilityDashboardWidget } from '../utils'
import FacilityOverview from './FacilityOverview'
import DashboardRoomsCapacity from './DashboardRoomsCapacity'
import FacilityDashboardStore from './FacilityDashboardStore'

@observer
class FacilityDashboardApp extends React.Component {
  constructor(props) {
    super(props)
    FacilityDashboardStore.loadFacilityOverview(this.props.currentFacilityId)
    FacilityDashboardStore.loadRoomsCapacity(this.props.currentFacilityId)
  }
  render() {
    return (
      <React.Fragment>
        <div className="pa4">
          <FacilityOverview facility_id={this.props.currentFacilityId} />

          <div className="pv4">
            <div className="ba b--light-gray pa3 bg-white br2">
              <DashboardRoomsCapacity
                facility_id={this.props.currentFacilityId}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default FacilityDashboardApp
