import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { TempIssueGroupWidgets } from '../../../utils'

@observer
class IssueByGroup extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Priority</h1>
        </div> */}
        <img src={TempIssueGroupWidgets} />
      </React.Fragment>
    )
  }
}

export default IssueByGroup
