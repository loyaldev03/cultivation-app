import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'

@observer
class PlantByRoomWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div className="flex">Plant By Room</div>
  }
}

export default PlantByRoomWidget
