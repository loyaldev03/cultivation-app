import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'

@observer
class PlantByPhaseWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div className="flex">Plant By Phase</div>
  }
}

export default PlantByPhaseWidget
