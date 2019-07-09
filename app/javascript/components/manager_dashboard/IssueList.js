import React from 'react'
import { TempHomeIssue } from '../utils'
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <img src={TempHomeIssue} height={350} />
      </React.Fragment>
    )
  }
}
