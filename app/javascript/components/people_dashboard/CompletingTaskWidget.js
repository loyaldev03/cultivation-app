import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { PeopleCompletingWidget } from '../utils'

@observer
class CompletingTaskWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Completing Task On Time</h1>
        </div> */}
        <img src={PeopleCompletingWidget} />
      </React.Fragment>
    )
  }
}

export default CompletingTaskWidget
