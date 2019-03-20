import React from 'react'
import PropTypes from 'prop-types'
import { observe, toJS } from 'mobx'
import { observer } from 'mobx-react'
import IssueForm from './components/IssueForm'
import IssueDetails from './components/IssueDetails'
import IssueHeader from './components/IssueHeader'
import currentIssueStore from './store/CurrentIssueStore'
// import getIssue from './actions/getIssue'

@observer
class IssueSidebar extends React.Component {
  // constructor(props) {
  //   super(props)
  //   // const issueId = props.id
  //   // const mode = props.mode

  //   // if (issueId) {
  //   //   getIssue(issueId)
  //   // } else if (mode === 'create') {
  //   //   currentIssueStore.reset()
  //   // }

  //   this.state = {
  //     ...this.resetState(),
  //     mode: props.mode,
  //   }

  //   // observe(currentIssueStore, 'mode', changes => {
  //   //   console.log('>> currentIssueStore.issue changed....')
  //   //   console.log(changes)
  //   //   const { mode } = this.state
  //   //   const issueId = toJS(currentIssueStore.issue.id)
  //   //   let state = this.resetState()

  //   //   if (mode === 'details') {
  //   //     state = { ...state, mode, issueId }
  //   //   } else if (!issueId) {
  //   //     state = { ...state, mode: 'create', issueId: '' }
  //   //   } else {
  //   //     state = { ...state, mode: 'edit', issueId }
  //   //   }
  //   //   this.setState({ state })
  //   // })
  // }

  onToggleMode = () => {
    if (currentIssueStore.mode === 'details') {
      // this.setState({ mode: 'edit' })
      currentIssueStore.mode = 'edit'
    } else {
      // this.setState({ mode: 'details' })
      currentIssueStore.mode = 'details'
    }
  }

  onClose = () => {
    if (currentIssueStore.mode === 'edit') {
      currentIssueStore.mode = 'details'
    } else {
      currentIssueStore.reset()
      this.props.onClose()
    }
  }

  onSaved = issue => {
    if (this.props.onSaved) {
      this.props.onSaved(issue)
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
    
    const issueId = currentIssueStore.issue ? currentIssueStore.issue.id : null
    
    if (currentIssueStore.mode === 'details') {
      return (
        <IssueDetails
          onClose={this.onClose}
          onToggleMode={this.onToggleMode}
          issueId={issueId}
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
          onSaved={this.onSaved}
          mode={currentIssueStore.mode}
          issueId={issueId}
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
          createdAt={currentIssueStore.mode === 'details' ? issue.created_at : ''}
          onClose={this.onClose}
          isArchived={issue.is_archived}
        />
        {this.renderBody()}
      </React.Fragment>
    )
  }
}

IssueSidebar.propTypes = {
  batch_id: PropTypes.string.isRequired,
  facility_id: PropTypes.string.isRequired,
  current_user_first_name: PropTypes.string.isRequired,
  current_user_last_name: PropTypes.string.isRequired,
  current_user_photo: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func
}

export default IssueSidebar
