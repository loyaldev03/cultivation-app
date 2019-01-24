import 'babel-polyfill'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Avatar from '../../utils/Avatar'
import Comments from './Comments'
import currentIssueStore from '../store/CurrentIssueStore'
import AttachmentThumbnail from './AttachmentThumbnail'
import AttachmentPopup from './AttachmentPopup'
import archiveIssue from '../actions/archiveIssue'

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
      followed_by: [],
      cultivation_batch: [], // maybe not needed
      reported_by: { first_name: '', last_name: '', photo: '' },
      assigned_to: { first_name: '', last_name: '', photo: '' },
      showMore: false,
      previewOpen: false,
      previewUrl: '',
      previewType: ''
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

    return (
      <React.Fragment>
        <div className="flex mt3 mb3 w-100 justify-end">
          <a href="#" className="link flex items-center outline-0">
            <span className="f7 gray mr2">Followed by</span>
            <Avatar
              firstName=""
              lastName=""
              photoUrl=""
              size={25}
              showNoUser
              onClick={() => alert('trigger assign followers')}
            />
          </a>
        </div>
        <div className="flex mt3 mb3 w-100 items-center justify-between">
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

  render() {

    const { current_user_first_name, current_user_last_name, current_user_photo } = this.props
    
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
            <div className="w-auto pv2 mr2">
              <Avatar
                firstName={assignedFirstName}
                lastName={assignedLastName}
                size={25}
                photoUrl={assignedPhoto}
                showNoUser={showNoUser}
                onClick={() => alert('trigger assign task to user')}
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
        <hr className="w-100" />
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
      </React.Fragment>
    )
  }
}

IssueDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  onToggleMode: PropTypes.func.isRequired,
  issueId: PropTypes.string.isRequired,
  batchId: PropTypes.string.isRequired,
  current_user_first_name: PropTypes.string.isRequired,
  current_user_last_name: PropTypes.string.isRequired,
  current_user_photo: PropTypes.string,
}

export default IssueDetails
