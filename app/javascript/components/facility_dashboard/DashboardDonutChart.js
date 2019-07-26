import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { FacilityDonutChartWidget } from '../utils'

@observer
class DashboardDonutChart extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Rooms Capacity</h1>
        </div> */}
        <img src={FacilityDonutChartWidget} />
      </React.Fragment>
    )
  }
}

export default DashboardDonutChart
