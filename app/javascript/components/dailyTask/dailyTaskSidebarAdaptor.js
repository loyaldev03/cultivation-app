import React from 'react'
import { observer } from 'mobx-react'
import sidebarStore from './stores/SidebarStore'
import dailyTasksStore from './stores/DailyTasksStore'
import currentIssueStore from '../issues/store/CurrentIssueStore'

const dailyTaskSidebarAdaptor = (IssueSidebar, props) => {
  const comp = class extends React.Component {
    onClose = () => {
      sidebarStore.closeIssues()
      currentIssueStore.reset()
    }

    onSaved = (batch_id, issue) => {
      console.log(issue)
      dailyTasksStore.updateOrAppendIssue(batch_id, issue)
    }

    render() {
      if (!sidebarStore.showIssues) {
        return null
      }

      const issueId = sidebarStore.issueId
      const batch_id = sidebarStore.batchId
      const facility_id = sidebarStore.facilityId
      console.log(issueId, batch_id, facility_id)

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
