import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import PlantByPhaseWidget from './PlantByPhaseWidget'
import PlantByRoomWidget from './PlantByRoomWidget'
@observer
class PlantWidgetApp extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="flex h-50">
        <div className="w-50">
          <div
            className="ba b--light-gray pa3 bg-white br2 mr3"
            style={{ height: 400 + 'px' }}
          >
            <PlantByPhaseWidget />
          </div>
        </div>
        <div className="w-50">
          <div
            className="ba b--light-gray pa3 bg-white br2 mr3"
            style={{ height: 400 + 'px' }}
          >
            <h1 className="f5 fw6 dark-grey">Plant Distribution by Room</h1>
            <PlantByRoomWidget facility_id={this.props.facility_id}/>
          </div>
        </div>
      </div>
    )
  }
}

export default PlantWidgetApp
