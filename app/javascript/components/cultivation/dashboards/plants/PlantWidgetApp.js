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
      <div className="flex">
        <div className="w-50">
          <div className="flex ba b--light-gray pa3 bg-white br2 mr1 mb1 ">
            <PlantByPhaseWidget />
          </div>
        </div>
        <div className="w-50 ml2">
          <div className="flex ba b--light-gray pa3 bg-white br2 mr1 mb1 ">
            <PlantByRoomWidget />
          </div>
        </div>
      </div>
    )
  }
}

export default PlantWidgetApp
