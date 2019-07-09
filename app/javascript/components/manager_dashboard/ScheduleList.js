import React from 'react'
import { TempHomeSchedule } from '../utils'
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <img src={TempHomeSchedule} />
      </React.Fragment>
    )
  }
}
