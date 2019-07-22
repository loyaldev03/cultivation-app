import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { TempHarvestYieldWidgets } from '../../../utils'

@observer
class PlantByRoomWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Yeild/Sq Feet</h1>
        </div> */}
        <img src={TempHarvestYieldWidgets} />
      </React.Fragment>
    )
  }
}

export default PlantByRoomWidget
