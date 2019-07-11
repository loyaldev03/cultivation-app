import React from 'react'
import { TempHomeUnassignTask } from '../utils'
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <img src={TempHomeUnassignTask} style={{height: 400+'px'}} />
      </React.Fragment>
    )
  }
}
