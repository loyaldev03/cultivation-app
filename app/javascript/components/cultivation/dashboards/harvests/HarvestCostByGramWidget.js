import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { TempHarvestCostWidgets } from '../../../utils'

@observer
class PlantByRoomWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Cost Per Gram</h1>
        </div> */}
        <img src={TempHarvestCostWidgets} />
      </React.Fragment>
    )
  }
}

export default PlantByRoomWidget
