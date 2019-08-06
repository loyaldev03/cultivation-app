import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { PeopleJobRoleWidget } from '../utils'

@observer
class JobRoleWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Job Roles</h1>
        </div> */}
        <img src={PeopleJobRoleWidget} />
      </React.Fragment>
    )
  }
}

export default JobRoleWidget
