import 'babel-polyfill'
import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'

import Avatar from '../../utils/Avatar'
import { SlidePanel } from '../../utils/SlidePanel'

import Comments from './Comments'
import currentIssueStore from '../store/CurrentIssueStore'
import AttachmentThumbnail from './AttachmentThumbnail'
import AttachmentPopup from './AttachmentPopup'
import ResolvedSegment from './ResolvedSegment'
import archiveIssue from '../actions/archiveIssue'
import saveFollowers from '../actions/saveFollowers'
import saveAssignTo from '../actions/saveAssignTo'

// TODO: move this to utils
import AssignResourceForm from '../../cultivation/tasks_setup/components/AssignResourceForm'

class IssueDetails extends Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
  }

  resetState() {
    return {
      expanded: false,
      issue_no: '',
      title: '',
      description: '',
      severity: '',
      status: '',
      issue_type: '',
      location_id: '',
      location_type: '',
      attachments: [],
      comments: [],
      task: null,
      cultivation_batch: [], // maybe not needed
      reported_by: { first_name: '', last_name: '', photo: '' },
      assigned_to: { first_name: '', last_name: '', photo: '' },
      showMore: false,
      previewOpen: false,
      previewUrl: '',
      previewType: '',
      showAssignTask: false,
      showAssignFollowers: false
    }
  }

  toggleEdit = event => {
    this.props.onToggleMode()
    event.preventDefault()
  }

  archiveIssue = event => {
    const id = currentIssueStore.issue.id
    const archiveConfirmation = window.confirm('Are you sure?')

    if (archiveConfirmation === true) {
      archiveIssue({ id: id }).then(({ status, data }) => {
        if (status != 200) {
          // Do action on failed
          this.setState({ errors: data.errors })
        } else {
          // Do action on success
        }
      })
    }

    event.preventDefault()
  }

  onToggleShowMore = event => {
    this.setState({ showMore: !this.state.showMore })
    event.preventDefault()
  }

  onTogglePreview = (url, mime_type) => {
    this.setState({
      previewOpen: !this.state.previewOpen,
      previewUrl: url,
      previewType: mime_type
    })
  }

  renderShowMore() {
    if (!this.state.showMore) {
      return (
        <div className="flex mt3 mb3">
          <a
            href="#"
            className="orange f6 link mt3"
            onClick={this.onToggleShowMore}
          >
            Show more
          </a>
        </div>
      )
    }

    const followers = currentIssueStore.issue.followers
    const followerIds = followers.map(x => x.id)
    const noFollowers = followers.length === 0

    return (
      <React.Fragment>
        <div className="flex mt3 mb3 w-100 justify-end items-center">
          
          <span className="f7 gray">Followed by</span>
          { noFollowers && 
            <div className="ml1">
              <Avatar
                firstName=""
                lastName=""
                photoUrl=""
                size={25}
                showNoUser
                onClick={event => {
                  this.assignFollowersForm.setSelectedUsers([])
                  this.setState({ showAssignFollowers: true })
                  event.preventDefault()
                }}
              />
            </div>
          }

          { !noFollowers && followers.map( x => (
            <div className="ml1" key={x.id}>
              <Avatar
                firstName={x.first_name}
                lastName={x.last_name}
                photoUrl={x.photo}
                size={25}
                onClick={event => {
                  console.log(followers)
                  this.assignFollowersForm.setSelectedUsers(followerIds)
                  this.setState({ showAssignFollowers: true })
                  event.preventDefault()
                }}
              />
            </div>
          ))}
          
        </div>
        <div className="flex mt3 mb4 w-100 items-center justify-between">
          <a
            href="#"
            onClick={this.onToggleShowMore}
            className="orange f6 fw4 link"
          >
            Show less
          </a>
          <div>
            <a
              href="#"
              onClick={this.toggleEdit}
              className="btn--secondary link f6 pv2 ph3 br2 mr2"
            >
              Edit
            </a>
            <a
              href="#"
              onClick={this.archiveIssue}
              className="btn--secondary link f6 pv2 ph3 br2"
            >
              Archive this issue
            </a>
          </div>
        </div>
      </React.Fragment>
    )
  }

  renderResolved() {
    if (currentIssueStore.issue.status === 'resolved') {
      return (
        <ResolvedSegment
          reason={currentIssueStore.issue.reason}
          resolutionNotes={currentIssueStore.issue.resolution_notes}
          resolvedByFirstName={currentIssueStore.issue.resolved_by.first_name}
          resolvedByLastName={currentIssueStore.issue.resolved_by.last_name}
          resolvedByPhoto={currentIssueStore.issue.resolved_by.photo}
          resolvedAt={currentIssueStore.issue.resolved_at}
        />
      )
    }

    return null
  }

  render() {
    const {
      current_user_first_name,
      current_user_last_name,
      current_user_photo
    } = this.props

    const issue = currentIssueStore.issue
    let assignedFirstName = '',
      assignedLastName = '',
      assignedPhoto = '',
      showNoUser = true

    if (issue.assigned_to) {
      ;({
        first_name: assignedFirstName,
        last_name: assignedLastName,
        photo: assignedPhoto
      } = issue.assigned_to)

      showNoUser = false
    }

    const assigned_to = currentIssueStore.issue.assigned_to ? [currentIssueStore.issue.assigned_to.id] : []
    return (
      <React.Fragment>
        <div
          className="ph3"
          style={{ marginTop: '-16px', marginBottom: '-3px' }}
        >
          <div
            style={{
              borderLeft: '2px solid #e8e8e8',
              height: '25px',
              marginLeft: '11px'
            }}
          />
        </div>

        <div className="ph3">
          <div className="flex w-100">
            <div className="w-auto pv2 mr2 mb3">
              <Avatar
                firstName={assignedFirstName}
                lastName={assignedLastName}
                size={25}
                photoUrl={assignedPhoto}
                showNoUser={showNoUser}
                onClick={() => {
                  this.assignResouceForm.setSelectedUsers(assigned_to)
                  this.setState({ showAssignTask: true })}
                }
              />
            </div>
            <div className="flex flex-column w-100">
              <div className="f5 fw6 dark-grey w-auto pv2 mt1">
                {issue.title}
              </div>
              <p className="fw4 f6 pre mt0 grey">{issue.description}</p>
              <div className="flex">
                {issue.attachments.map(x => (
                  <AttachmentThumbnail
                    key={x.key}
                    id={x.key}
                    url={x.url}
                    preview={x.url}
                    type={x.mime_type}
                    filename=""
                    onClick={() => this.onTogglePreview(x.url, x.mime_type)}
                    showDelete={false}
                  />
                ))}
              </div>
              {this.renderShowMore()}
            </div>
          </div>
        </div>
        {this.renderResolved()}
        <hr className="w-100 mt0" />
        <Comments
          issueId={issue.id}
          issueNo={issue.issue_no}
          current_user_first_name={current_user_first_name}
          current_user_last_name={current_user_last_name}
          current_user_photo={current_user_photo}
        />
        <AttachmentPopup
          open={this.state.previewOpen}
          key={this.state.previewUrl}
          url={this.state.previewUrl}
          type={this.state.previewType}
          onClose={this.onTogglePreview}
        />
        <SlidePanel
          width="500px"
          show={this.state.showAssignTask}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <AssignResourceForm
                title="Assign Issue"
                facilityId={this.props.facilityId}
                selectMode="single"
                ref={form => (this.assignResouceForm = form)}
                onClose={() => {
                  this.setState({ showAssignTask: false })
                }}
                onSave={users => {
                  if (users && users.length > 0) {
                    saveAssignTo({ id: issue.id, user: users[0] })
                    this.setState({ showAssignTask: false })
                  }
                }}
              />
            </Suspense>
          )}
        />
        <SlidePanel
          width="500px"
          show={this.state.showAssignFollowers}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <AssignResourceForm
                title="Assign Followers"
                facilityId={this.props.facilityId}
                selectMode="multiple"
                ref={form => (this.assignFollowersForm = form)}
                onClose={() => {
                  this.setState({ showAssignFollowers: false })
                }}
                onSave={users => {
                  if (users && users.length > 0) {
                    saveFollowers({ id: issue.id, users })
                    this.setState({ showAssignFollowers: false })
                  }
                }}
              />
            </Suspense>
          )}
        />
      </React.Fragment>
    )
  }
}

IssueDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  onToggleMode: PropTypes.func.isRequired,
  issueId: PropTypes.string.isRequired,
  batchId: PropTypes.string.isRequired,
  facilityId: PropTypes.string.isRequired,
  current_user_first_name: PropTypes.string.isRequired,
  current_user_last_name: PropTypes.string.isRequired,
  current_user_photo: PropTypes.string
}

export default IssueDetails
