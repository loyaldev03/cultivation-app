import React from 'react'
import { formatDate } from './../../utils'

class BatchSetupEditor extends React.PureComponent {
  render() {
    const { date } = this.props
    return (
      <div>
        <div>{formatDate(date)}</div>
        <div></div>
        <div>Strain</div>
      </div>
    )
  }
}

export default BatchSetupEditor
