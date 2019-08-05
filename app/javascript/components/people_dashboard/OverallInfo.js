import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { PeopleOverallInfoWidget } from '../utils'

@observer
class OverallInfo extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Overall Info</h1>
        </div> */}
        <img src={PeopleOverallInfoWidget} />
      </React.Fragment>
    )
  }
}

export default OverallInfo
