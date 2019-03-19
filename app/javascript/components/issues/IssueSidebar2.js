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
    const issueId = props.id
    const mode = props.mode

    if (issueId) {
      getIssue(issueId)
    } else if (mode === 'create') {
      currentIssueStore.reset()
    }

    let state = this.resetState()
    if (mode === 'details') {
      state = { ...state, mode, issueId }
    } else if (!issueId) {
      state = { ...state, mode: 'create', issueId: '' }
    } else {
      state = { ...state, mode: 'edit', issueId }
    }

    this.state = state
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
      this.props.onClose()
    }
  }

  onCreated = issue => {
    if (this.props.onCreated) {
      this.props.onCreated(issue)
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
          onCreated={this.onCreated}
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
  issueId: PropTypes.string,
  batch_id: PropTypes.string.isRequired,
  facility_id: PropTypes.string.isRequired,
  current_user_first_name: PropTypes.string.isRequired,
  current_user_last_name: PropTypes.string.isRequired,
  current_user_photo: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func
}

export default IssueSidebar
