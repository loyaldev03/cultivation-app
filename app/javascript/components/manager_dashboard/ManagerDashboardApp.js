import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import OverallInfo from './OverallInfo'
import ChartStore from './ChartStore'
@observer
class ManagerDashboardApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = { date: new Date(), batches: props.batches }
    ChartStore.loadWorkerCapacity(props.batches[0].id)
  }

  render() {
    return (
      <React.Fragment>
        <h1>Manager Dashboard App</h1>
        <OverallInfo batches={this.state.batches}/>
      </React.Fragment>
    )
  }
}

export default ManagerDashboardApp
