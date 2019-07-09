import React from 'react'
import {
  TempBatchDistribution,
} from '../utils'
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <img src={TempBatchDistribution} height={350} />
      </React.Fragment>
    )
  }
}