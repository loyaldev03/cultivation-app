import React from 'react'
import { observer } from 'mobx-react'
import sidebarStore from './stores/SidebarStore'
import dailyTasksStore from './stores/DailyTasksStore'

const dailyTaskSidebarAdaptor = (IssueSidebar, props) => {
  const comp = class extends React.Component {
    onClose = () => {
      sidebarStore.closeIssues()
    }

    onCreated = (batch_id, newIssue) => {
      // console.group('onCreated')
      // console.log(batch_id)
      // console.log(newIssue)
      // inject issue into the task

      dailyTasksStore.appendIssue(batch_id, newIssue)
      // console.groupEnd()
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
          onCreated={newIssue => this.onCreated(batch_id, newIssue)}
        />
      )
    }
  }

  const observerComp = observer(comp)
  return observerComp
}

export default dailyTaskSidebarAdaptor
