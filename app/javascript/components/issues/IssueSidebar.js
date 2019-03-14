import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observe } from 'mobx'
import IssueForm from './components/IssueForm'
import IssueDetails from './components/IssueDetails'
import IssueHeader from './components/IssueHeader'
import currentIssueStore from './store/CurrentIssueStore'
import getIssue from './actions/getIssue'
import dailyTaskSidebarStore from '../dailyTask/stores/SidebarStore'
@observer
class IssueSidebar extends React.Component {
  state = this.resetState()

  componentDidMount() {
    observe(dailyTaskSidebarStore, 'showIssues', change => {
      if (change.newValue) {
        const issueId = dailyTaskSidebarStore.issueId
        const mode = dailyTaskSidebarStore.issueMode
        const dailyTask = dailyTaskSidebarStore.dailyTask
        if (issueId) {
          getIssue(issueId)
        } else if (mode === 'create') {
          currentIssueStore.reset()
        }

        if (mode === 'details') {
          this.setState({ mode, issueId, dailyTask })
        } else if (!issueId) {
          this.setState({ mode: 'create', issueId: '' })
        } else {
          this.setState({ mode: 'edit', issueId })
        }
      }
    })
  }

  resetState() {
    return {
      issueId: '',
      mode: 'create'
    }
  }

  onToggleMode = () => {
    if (this.state.mode === 'details') {
      this.setState({ mode: 'edit' })
    } else {
      this.setState({ mode: 'details' })
    }
  }

  onClose = () => {
    if (this.state.mode === 'edit') {
      this.setState({ mode: 'details' })
    } else {
      currentIssueStore.reset()
      dailyTaskSidebarStore.closeIssues()
      // window.editorSidebar.close()
    }
  }

  renderBody() {
    const {
      batch_id,
      facility_id,
      current_user_first_name,
      current_user_last_name,
      current_user_photo
    } = this.props
    const { mode } = this.state

    if (mode === 'details') {
      return (
        <IssueDetails
          onClose={this.onClose}
          onToggleMode={this.onToggleMode}
          issueId={this.state.issueId}
          batchId={batch_id}
          facilityId={facility_id}
          current_user_first_name={current_user_first_name}
          current_user_last_name={current_user_last_name}
          current_user_photo={current_user_photo}
          dailyTask={this.state.dailyTask}
        />
      )
    } else {
      return (
        <IssueForm
          onClose={this.onClose}
          onToggleMode={this.onToggleMode}
          mode={this.state.mode}
          issueId={this.state.issueId}
          batchId={batch_id}
          facilityId={facility_id}
        />
      )
    }
  }

  render() {
    const issue = currentIssueStore.issue
    return (
      <React.Fragment>
        <IssueHeader
          reporterFirsName={issue.reported_by.first_name}
          reporterLastName={issue.reported_by.last_name}
          reporterPhotoUrl={issue.reported_by.photo}
          issueNo={issue.issue_no}
          severity={issue.severity}
          status={issue.status}
          createdAt={this.state.mode === 'details' ? issue.created_at : ''}
          onClose={this.onClose}
          isArchived={issue.is_archived}
        />
        {this.renderBody()}
      </React.Fragment>
    )
  }
}

IssueSidebar.propTypes = {
  batch_id: PropTypes.string,
  facility_id: PropTypes.string,
  current_user_first_name: PropTypes.string.isRequired,
  current_user_last_name: PropTypes.string.isRequired,
  current_user_photo: PropTypes.string
}

export default IssueSidebar
