import React from 'react'
import { TempHomeUnassignTask } from '../utils'
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <img src={TempHomeUnassignTask} />
      </React.Fragment>
    )
  }
}
