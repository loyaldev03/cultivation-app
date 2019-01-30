import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import DashboardModal from '@uppy/react/lib/DashboardModal'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'
import setupUppy from './setupUppy'

import { formatIssueNo } from './FormatHelper'
import CommentMessage from './CommentMessage'
import AttachmentThumbnail from './AttachmentThumbnail'
import AttachmentPopup from './AttachmentPopup'
import ResolveIssueForm from './ResolveIssueForm'
import CommentMenu from './CommentMenu'
import ResolvedComment from './ResolvedComment'

import currentIssue from '../store/CurrentIssueStore'
import addComment from '../actions/addComment'
import resolveIssue from '../actions/resolveIssue'

import Avatar from '../../utils/Avatar.js'

@observer
class Comments extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
    this.newCommentText = React.createRef()
    this.uppy = setupUppy(this.onUppyComplete)
  }

  resetState() {
    return {
      newComment: '',
      attachments: [],
      delete_attachments: [],
      uppyOpen: false,
      previewOpen: false,
      previewUrl: '',
      previewType: '',
      showCommentMenuId: '',
      showAddComment: true,
      showResolveForm: false,
      showNewTaskForm: false
    }
  }

  onUppyComplete = result => {
    if (result.successful) {
      let attachments = this.state.attachments
      const newAttachments = result.successful.map(file => {
        return {
          id: '',
          key: file.meta.key,
          filename: file.meta.name,
          url: file.preview,
          mime_type: file.type,
          data: JSON.stringify({
            id: file.meta.key.match(/^cache\/(.+)/)[1],
            storage: 'cache',
            metadata: {
              size: file.size,
              filename: file.name,
              mime_type: file.type
            }
          })
        }
      })
      attachments = [...attachments, ...newAttachments]
      this.setState({ attachments })
    }
  }

  onUppyOpen = () => {
    window.editorSidebar.scrollToTop()
    this.setState({ uppyOpen: !this.state.uppyOpen })
  }

  onUppyClose = () => {
    this.setState({ uppyOpen: false })
    this.uppy.reset()
  }

  onChangeNewComment = event => {
    this.setState(
      {
        newComment: event.target.value
      },
      this.resizeCommentText
    )
  }

  onAddComment = event => {
    addComment({
      issueId: this.props.issueId,
      message: this.state.newComment,
      attachments: this.state.attachments
    }).then(({ status }) => {
      if (status != 200) {
        alert('something wrong')
      } else {
        event.preventDefault()
        this.setState(
          { newComment: '', attachments: [] },
          this.resizeCommentText
        )
        window.editorSidebar.scrollToBottom()
      }
    })
  }

  resizeCommentText = () => {
    // Reset field height
    const field = this.newCommentText.current
    field.style.height = 'inherit'

    // Get the computed styles for the element
    const computed = window.getComputedStyle(field)

    // Calculate the height
    let height =
      parseInt(computed.getPropertyValue('border-top-width'), 10) +
      parseInt(computed.getPropertyValue('padding-top'), 10) +
      field.scrollHeight +
      parseInt(computed.getPropertyValue('padding-bottom'), 10) +
      parseInt(computed.getPropertyValue('border-bottom-width'), 10)

    if (height <= 24) {
      height = 25
    }

    field.style.height = height + 'px'
  }

  onTogglePreview = (url = '', type = '', filename) => {
    this.setState({
      previewOpen: !this.state.previewOpen,
      previewUrl: url,
      previewType: type
    })
  }

  onDeleteAttachment = key => {
    const result = confirm('Remove attachment?')
    if (result) {
      const attachment = this.state.attachments.find(x => x.key == key)
      this.setState({
        attachments: this.state.attachments.filter(x => x.key != key),
        delete_attachments: [...this.state.delete_attachments, key]
      })
    }
  }

  handleEllipsisClick = id => {
    this.setState({ showCommentMenuId: id })
  }

  handleMouseLeave = () => {
    this.setState({
      showCommentMenuId: ''
    })
  }

  handleShowResolve = () => {
    this.setState({
      showResolveForm: true,
      showCommentMenuId: '',
      showAddComment: false
    })

    window.editorSidebar.scrollToBottom()
  }

  onReplyComment = () => {
    window.editorSidebar.scrollToBottom()
    this.newCommentText.current.focus()
  }

  onSubmitResolve = data => {
    if (!data.cancel) {
      const merged = { ...data, id: currentIssue.issue.id }
      resolveIssue(merged)
    }
    this.setState({
      showResolveForm: false,
      showCommentMenuId: '',
      showAddComment: true
    })
  }

  renderResolveForm() {
    if (!this.state.showResolveForm) {
      return null
    }

    const {
      current_user_first_name,
      current_user_last_name,
      current_user_photo
    } = this.props

    return (
      <ResolveIssueForm
        firstName={current_user_first_name}
        lastName={current_user_last_name}
        photoUrl={current_user_photo}
        onSubmit={this.onSubmitResolve}
      />
    )
  }

  renderNewTaskForm() {
    return null
  }

  renderAttachments() {
    if (this.state.attachments.length === 0) {
      return null
    }

    const attachments = this.state.attachments.map(x => {
      return (
        <AttachmentThumbnail
          key={x.key}
          id={x.key}
          url={x.url}
          preview={x.url}
          type={x.mime_type}
          filename=""
          onClick={() => this.onTogglePreview(x.url, x.mime_type)}
          showDelete={true}
          onDelete={() => this.onDeleteAttachment(x.key)}
        />
      )
    })

    return <div className="mt2 flex flex-auto">{attachments}</div>
  }

  renderResolvedComment() {
    if (currentIssue.issue.status === 'resolved') {
      return (
        <ResolvedComment
          reason={currentIssue.issue.reason}
          resolutionNotes={currentIssue.issue.resolution_notes}
          resolvedByFirstName={currentIssue.issue.resolved_by.first_name}
          resolvedByLastName={currentIssue.issue.resolved_by.last_name}
          resolvedByPhoto={currentIssue.issue.resolved_by.photo}
          resolvedAt={currentIssue.issue.resolved_at}
          is_me={currentIssue.issue.resolved_by.is_me}
        />
      )
    }
    return null
  }

  renderAddComment() {
    if (currentIssue.issue.status === 'resolved') {
      return null
    }

    const {
      current_user_first_name,
      current_user_last_name,
      current_user_photo
    } = this.props

    const hasComment = currentIssue.comments && currentIssue.comments.length > 0
    const { showAddComment } = this.state
    return (
      <div
          className={`ph3 mb4 ${hasComment && 'mt3'} ${!showAddComment &&
            'dn'}`}
        >
          <div className="b--black-10 flex br3 ba w-100 ph2 pt1 pb2 flex items-start">
            <div style={{ marginTop: '3px' }}>
              <Avatar
                firstName={current_user_first_name}
                lastName={current_user_last_name}
                photoUrl={current_user_photo}
                size={25}
              />
            </div>
            <div className="flex flex-column flex-auto ml2">
              <textarea
                ref={this.newCommentText}
                type="text"
                className="bn flex-auto flex f6 dark-grey outline-0 pl0"
                style={{ resize: 'none', paddingTop: '4px' }}
                rows="1"
                value={this.state.newComment}
                onChange={this.onChangeNewComment}
              />
              {this.renderAttachments()}
            </div>

            <a
              href="#"
              onClick={this.onUppyOpen}
              className="flex items-center link self-end"
              style={{ height: '25px' }}
            >
              <span
                className="material-icons black-30 f6 v-mid hover-black-50"
                style={{ fontSize: '23px' }}
              >
                add
              </span>
            </a>
            <a
              href="#"
              className="ml1 flex items-center link self-end"
              style={{ height: '25px' }}
              onClick={this.onAddComment}
            >
              <span
                className="material-icons black-30 f6 v-mid hover-black-50"
                style={{ fontSize: '18px' }}
              >
                send
              </span>
            </a>
          </div>
        </div>
    )
  }

  render() {
   
    const hasComment = currentIssue.comments && currentIssue.comments.length > 0

    return (
      <React.Fragment>
        <div className="flex ph3 pb3 items-center mt3">
          <div className="f7 fw6 gray w-auto mr1">
            ISSUE {formatIssueNo(this.props.issueNo)}
          </div>
          <div className="f7 fw6 gray w-auto mr1 self-start">&bull;</div>
          <div className="f7 fw6 gray w-auto">Discussion</div>
        </div>
        {hasComment &&
          currentIssue.comments.map(x => {
            return (
              <CommentMessage
                key={x.id}
                {...x}
                onTogglePreview={this.onTogglePreview}
                isMenuOpen={this.state.showCommentMenuId === x.id}
                renderMenu={isMenuOpen => (
                  <CommentMenu
                    isOpen={isMenuOpen}
                    id={x.id}
                    handleEllipsisClick={this.handleEllipsisClick}
                    handleMouseLeave={this.handleMouseLeave}
                    handleResolve={this.handleShowResolve}
                    handleReply={this.onReplyComment}
                  />
                )}
              />
            )
          })}
        { this.renderResolvedComment() }
        { this.renderAddComment() }
        {this.renderResolveForm()}
        {this.renderNewTaskForm()}
        <DashboardModal
          uppy={this.uppy}
          closeModalOnClickOutside
          open={this.state.uppyOpen}
          onRequestClose={this.onUppyClose}
          proudlyDisplayPoweredByUppy={false}
          plugins={['Webcam', 'Dropbox', 'AwsS3']}
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

export default Comments
