import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import IssueForm from './components/IssueForm'
import IssueDetails from './components/IssueDetails'
import IssueHeader from './components/IssueHeader'
import currentIssueStore from './store/CurrentIssueStore'
import getIssue from './actions/getIssue'

@observer
class IssueSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {
      const issueId = event.detail.id
      const mode = event.detail.mode

      if (issueId) {
        getIssue(issueId)
      } else if (mode === 'create') {
        currentIssueStore.reset()
      }

      if (mode === 'details') {
        this.setState({ mode, issueId })
      } else if (!issueId) {
        this.setState({ mode: 'create', issueId: '' })
      } else {
        this.setState({ mode: 'edit', issueId })
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
      window.editorSidebar.close()
    }
  }

  renderBody() {
    const {
      batch_id,
      facility_id,
      current_user_first_name,
      current_user_last_name,
      current_user_photo,
      daily_task
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
          daily_task={daily_task}
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
      <div className="rc-slide-panel" data-role="sidebar">
        <div className="rc-slide-panel__body flex flex-column relative">
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
        </div>
      </div>
    )
  }
}

IssueSidebar.propTypes = {
  batch_id: PropTypes.string.isRequired,
  facility_id: PropTypes.string.isRequired,
  current_user_first_name: PropTypes.string.isRequired,
  current_user_last_name: PropTypes.string.isRequired,
  current_user_photo: PropTypes.string
}

export default IssueSidebar
