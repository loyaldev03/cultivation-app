import React from 'react'
import { observer } from 'mobx-react'
import SidebarStore from './stores/SidebarStore'
import DailyTasksStore from './stores/DailyTasksStore'
import CurrentIssueStore from '../issues/store/CurrentIssueStore'

const dailyTaskSidebarAdaptor = (IssueSidebar, props) => {
  const comp = class extends React.Component {
    onClose = () => {
      SidebarStore.closeSidebar()
      CurrentIssueStore.reset()
    }

    onSaved = (batch_id, issue) => {
      DailyTasksStore.updateOrAppendIssue(batch_id, issue)
    }

    render() {
      if (!SidebarStore.showIssues) {
        return null
      }

      const issueId = SidebarStore.issueId
      const batch_id = SidebarStore.batchId
      const facility_id = SidebarStore.facilityId

      return (
        <IssueSidebar
          batch_id={batch_id}
          facility_id={facility_id}
          {...props}
          onClose={this.onClose}
          onSaved={issue => this.onSaved(batch_id, issue)}
        />
      )
    }
  }

  const observerComp = observer(comp)
  return observerComp
}

export default dailyTaskSidebarAdaptor
