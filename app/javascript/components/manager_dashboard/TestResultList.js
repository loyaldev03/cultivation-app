import React from 'react'
import { TempTestResult } from '../utils'
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <img src={TempTestResult} height={350} />
      </React.Fragment>
    )
  }
}
