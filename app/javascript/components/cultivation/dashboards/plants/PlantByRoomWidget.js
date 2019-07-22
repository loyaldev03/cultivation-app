import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { TempPlantByRooomWidgets } from '../../../utils'

@observer
class PlantByRoomWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Plant By Room</h1>
        </div> */}
        <img src={TempPlantByRooomWidgets} />
      </React.Fragment>
    )
  }
}

export default PlantByRoomWidget
