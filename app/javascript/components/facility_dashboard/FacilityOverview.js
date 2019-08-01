import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import FacilityDashboardStore from './FacilityDashboardStore'
import { numberFormatter } from '../utils'

const FacilityWidget = ({
  title,
  count,
  icon = 'access_time',
  className = '',
  loaded = false
}) => {
  return (
    <div
      className="flex items-center ba b--light-gray pa3 bg-white br2 mr1 mb1 "
      style={{ height: 150 + 'px', width: '50%' }}
    >
      <div className="flex" style={{ flex: ' 1 1 auto' }}>
        <i
          className={`material-icons white bg-orange md-48 ${className}`}
          style={{ borderRadius: '50%' }}
        >
          {icon}
        </i>
        <div className="tc">
          <h1 className="f5 fw6 grey">{title}</h1>
          {loaded ? <b className="f2 fw6 dark-grey">{count}</b> : 'loading...'}
        </div>
      </div>
    </div>
  )
}

@observer
class FacilityOverview extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-between">
          <FacilityWidget
            title="Capacity"
            count={` ${
              FacilityDashboardStore.data_facility_overview.facility_capacity
            } %`}
            className="ma3"
            icon="home"
            loaded={FacilityDashboardStore.facility_overview_loaded}
          />
          <FacilityWidget
            title="Available spots for plants"
            count={numberFormatter.format(
              FacilityDashboardStore.data_facility_overview.available_spots
            )}
            className="ma3"
            icon="scatter_plot"
            loaded={FacilityDashboardStore.facility_overview_loaded}
          />
          <FacilityWidget
            title="Average yeild/ sq ft"
            count={` ${numberFormatter.format(
              FacilityDashboardStore.data_facility_overview.average_yield
            )} lbs`}
            className="ma3"
            icon="spa"
            loaded={FacilityDashboardStore.facility_overview_loaded}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default FacilityOverview
