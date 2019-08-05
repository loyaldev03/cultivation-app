import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { PeopleOntimeWidget } from '../utils'

@observer
class OntimeArrivalsWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">On Time Arrivals</h1>
        </div> */}
        <img src={PeopleOntimeWidget} />
      </React.Fragment>
    )
  }
}

export default OntimeArrivalsWidget

