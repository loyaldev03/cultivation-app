import React from 'react'
import { observer } from 'mobx-react'
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns'
import PeopleDashboardStore from './PeopleDashboardStore'
import WorkerSalary from './WorkerSalary'
import HeadCountWidget from './HeadCountWidget'
import AttritionWidget from './AttritionWidget'
@observer
class PeopleDashboardApp extends React.Component {
  constructor(props) {
    super(props)
    PeopleDashboardStore.loadWorkerSalary(this.props.facility_id)
    PeopleDashboardStore.loadheadCount(this.props.facility_id)
    PeopleDashboardStore.loadAttrition(this.props.facility_id, "", 2019)
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex mt4 h-50">
          <div className="w-30">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: 320 + 'px' }}
            >
              <WorkerSalary />
            </div>
          </div>
          <div className="w-60">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: 320 + 'px' }}
            >
              <AttritionWidget />
            </div>
          </div>
          <div className="w-30">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: 320 + 'px' }}
            >
              <HeadCountWidget />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default PeopleDashboardApp
