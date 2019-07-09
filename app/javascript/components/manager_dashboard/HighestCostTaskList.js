import React from 'react'
import {
  TempHomeTaskHighestCost,
} from '../utils'
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <img src={TempHomeTaskHighestCost} height={350} />
      </React.Fragment>
    )
  }
}