import React from 'react'
import {
  TempHomeStrain,
} from '../utils'
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <img src={TempHomeStrain} height={350} />
      </React.Fragment>
    )
  }
}