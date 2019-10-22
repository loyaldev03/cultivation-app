import React from 'react'
import { observer } from 'mobx-react'
import WorkerOverallInfo from './components/WorkerOverallInfo'
import StatusTile from './components/StatusTile'
import DashboardPaymentDetail from './components/PaymentDetails'
import dailyTaskSidebarAdaptor from '../dailyTask/dailyTaskSidebarAdaptor'
import IssueSidebar from '../issues/IssueSidebar2'
import SidebarStore from '../../components/dailyTask/stores/SidebarStore'
import workerDashboardStore from './stores/WorkerDashboardStore'
import {
  formatDate3,
  SlidePanel,
  SlidePanelHeader,
  SlidePanelFooter
} from '../utils'

@observer
class WorkerDashboardApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      date: new Date(), 
      arr_ranges: [
        { val: 'weekly', label: 'Weekly' },
        { val: 'monthly', label: 'Monthly' }
      ]
    }
  }

  renderSlidePanel() {
    const { showIssues } = SidebarStore
    const IssueSideBarWithStore = dailyTaskSidebarAdaptor(
      IssueSidebar,
      this.props
    )
    return (
      <React.Fragment>
        <SlidePanel
          width="500px"
          show={showIssues}
          renderBody={props => <IssueSideBarWithStore />}
        />
      </React.Fragment>
    )
  }

  onChange = date => this.setState({ date })

  render() {
    let { arr_ranges } = this.state
    let { date } = this.props
    return (
      <React.Fragment>
        <WorkerOverallInfo arr_ranges={arr_ranges}/>
        <StatusTile date={date} />
        {/* <DashboardPaymentDetail /> */}
        {this.renderSlidePanel()}
      </React.Fragment>
    )
  }
}

export default WorkerDashboardApp
