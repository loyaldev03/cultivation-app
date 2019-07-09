import React from 'react'
import {
  TempHomePerformer,
} from '../utils'
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <img src={TempHomePerformer} height={350} />
      </React.Fragment>
    )
  }
}