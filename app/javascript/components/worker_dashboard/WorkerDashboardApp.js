import React from 'react'
import { observer } from 'mobx-react'
import OverallInfo from './components/OverallInfo'
import StatusTile from './components/StatusTile'
import DashboardPaymentDetail from './components/PaymentDetails'
import dailyTaskSidebarAdaptor from '../dailyTask/dailyTaskSidebarAdaptor'
import IssueSidebar from '../issues/IssueSidebar2'
import SidebarStore from '../../components/dailyTask/stores/SidebarStore'
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
    this.state = { date: new Date() }
  }

  renderSlidePanel() {
    const {
      showIssues,
    } = SidebarStore
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
    let { date } = this.props
    return (
      <React.Fragment>
        <OverallInfo />
        <StatusTile date={date} />
        <DashboardPaymentDetail />
        {this.renderSlidePanel()}
      </React.Fragment>
    )
  }
}

export default WorkerDashboardApp
