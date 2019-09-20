import React, { memo, useState, lazy, Suspense } from 'react'
import { differenceInDays } from 'date-fns'
import { observer } from 'mobx-react'
import {
  decimalFormatter,
  formatDate2,
  ActiveBadge,
  CheckboxSelect,
  Loading,
  HeaderFilter,
  ListingTable,
  SlidePanel
} from '../../utils'
//import loadPlants from '../../inventory/plant_setup/actions/loadPlants'
//import PlantStore from '../../inventory/plant_setup/store/PlantStore'
import ReportDestroyedPlants from '../../cultivation/tasks_setup/components/ReportDestroyedPlants'
//import PlantWidgetApp from './plants/PlantWidgetApp'
//import DashboardPlantStore from './plants/DashboardPlantStore'

@observer
class DestroyedPlantApp extends React.Component {
  constructor(props) {
    super(props)
    // DashboardPlantStore.loadBatchDistribution(
    //   'all',
    //   this.props.currentFacilityId
    // )
  }
  state = {
    showDestroyedPlants: false
  }

  render() {
    const { currentFacilityId } = this.props
    const { columns, showDestroyedPlants } = this.state
    return (
      <div className="pa4 pb0">
        <div className="flex flex-row-reverse">
          <a
            href="#0"
            className="btn btn--primary"
            onClick={() =>
              this.setState({
                showDestroyedPlants: true
              })
            }
          >
            Destroy Plants
          </a>
        </div>
        <div id="toast" className="toast" />
        <SlidePanel
          show={showDestroyedPlants}
          renderBody={props => (
            <ReportDestroyedPlants
              batch_id={currentFacilityId}
              title="Report Destroyed Plants"
              onClose={() => this.setState({ showDestroyedPlants: false })}
            />
          )}
        />
      </div>
    )
  }
}

export default DestroyedPlantApp
