import React from 'react'
import { observer } from 'mobx-react'
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns'
import { PeopleDashboardWidget } from '../utils'
import PeopleDashboardStore from './PeopleDashboardStore'

import OverallInfo from './OverallInfo'
import ReminderWidget from './ReminderWidget'
import WorkerSalary from './WorkerSalary'
import HeadCountWidget from './HeadCountWidget'
import AttritionWidget from './AttritionWidget'
import CapacityPlanning from './CapacityPlanning'
import OntimeArrivalsWidget from './OntimeArrivalsWidget'
import CompletingTaskWidget from './CompletingTaskWidget'
import SkillDistributionWidget from './SkillDistributionWidget'
import JobRoleWidget from './JobRoleWidget'

@observer
class PeopleDashboardApp extends React.Component {
  constructor(props) {
    super(props)
    PeopleDashboardStore.loadOverallInfo(this.props.currentFacilityId, 'All')
    PeopleDashboardStore.loadWorkerSalary(this.props.currentFacilityId, 2019)
    PeopleDashboardStore.loadheadCount(this.props.currentFacilityId, 2019)
    PeopleDashboardStore.loadReminder(this.props.currentFacilityId)
    PeopleDashboardStore.loadAttrition(this.props.currentFacilityId, '', 2019)
    PeopleDashboardStore.loadCapacityPlanning(
      this.props.currentFacilityId,
      'all'
    )
    PeopleDashboardStore.loadRoles()
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-between mb3">
          <div className="w-70">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: '200px' }}
            >
              <OverallInfo facility_id={this.props.currentFacilityId} />
            </div>
          </div>
          <div className="w-30">
            <div
              className="ba b--light-gray pa3 bg-white br2"
              style={{ height: '200px' }}
            >
              <ReminderWidget />
            </div>
          </div>
        </div>

        <div className="flex justify-between mb3">
          <div className="w-30">
            <div
              className="ba b--light-gray pa3 bg-white mr3"
              style={{ height: '320px' }}
            >
              <HeadCountWidget facility_id={this.props.currentFacilityId} />
            </div>
          </div>
          <div className="w-40">
            <div
              className="ba b--light-gray pa3 bg-white mr3"
              style={{ height: '320px' }}
            >
              <AttritionWidget facility_id={this.props.currentFacilityId} />
            </div>
          </div>
          <div className="w-30">
            <div
              className="ba b--light-gray pa3 bg-white br2"
              style={{ height: '320px' }}
            >
              <WorkerSalary facility_id={this.props.currentFacilityId} />
            </div>
          </div>
        </div>

        <div className="flex justify-between w-100 mb3">
          <CapacityPlanning facility_id={this.props.currentFacilityId} />
        </div>

        <div className="flex justify-between mb3">
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: '400px' }}
            >
              <OntimeArrivalsWidget
                facility_id={this.props.currentFacilityId}
              />
            </div>
          </div>
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: '400px' }}
            >
              <CompletingTaskWidget
                facility_id={this.props.currentFacilityId}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between mb3">
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: '400px' }}
            >
              <SkillDistributionWidget
                facility_id={this.props.currentFacilityId}
              />
            </div>
          </div>
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: '400px' }}
            >
              <JobRoleWidget facility_id={this.props.currentFacilityId} />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default PeopleDashboardApp
