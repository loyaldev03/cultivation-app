import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { PeopleSkillDistributionWidget } from '../utils'

@observer
class SkillDistributionWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Skill Distribution</h1>
        </div> */}
        <img src={PeopleSkillDistributionWidget} />
      </React.Fragment>
    )
  }
}

export default SkillDistributionWidget
