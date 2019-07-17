import React from 'react'
import { observer } from 'mobx-react'
import OverallInfo from './components/OverallInfo'
import StatusTile from './components/StatusTile'
import DashboardPaymentDetail from './components/PaymentDetails'

@observer
class WorkerDashboardApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = { date: new Date() }
  }

  onChange = date => this.setState({ date })

  render() {
    let { date } = this.props
    return (
      <React.Fragment>
        <OverallInfo />
        <StatusTile date={date} />
        <DashboardPaymentDetail />
      </React.Fragment>
    )
  }
}

export default WorkerDashboardApp
