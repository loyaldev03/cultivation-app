import React from 'react'
import Avatar from '../../utils/Avatar.js'
import AttachmentThumbnail from './AttachmentThumbnail'
import { formatDate, formatTime } from '../../utils/DateHelper'

const CommentBody = ({
  id,
  message,
  attachments = [],
  resolved = false,
  reason = '',
  onClick = (url, mime_type) => {},
  isMenuOpen = false,
  renderMenu = isMenuOpen => null // renderMenu is a method that accepts params to indicate menu is open or not.
}) => {
  return (
    <div className="mb2 pv2 pl3 pr0 br2 bg-black-05">
      {resolved && (
        <p className="green f6 fw6 mt0 mb2 flex">
          <span className="mt1" style={{ marginTop: '2px' }}>
            Resolved
          </span>
          <span className="material-icons ml1" style={{ fontSize: '18px' }}>
            check
          </span>
        </p>
      )}
      <div className="flex">
        <p className="f6 black-70 lh-title mt0 mb1 flex-auto pre">{message}</p>
        {renderMenu(isMenuOpen)}
      </div>
      {reason.length > 0 && (
        <p className="f6 black-70 lh-title mt0 mb1 flex-auto pr3">
          Reason: {reason}
        </p>
      )}
      {attachments.length > 0 && (
        <div className="flex flex-wrap mt2 mb1">
          {attachments.map(props => (
            <AttachmentThumbnail
              key={`${id}.${props.url}`}
              {...props}
              onClick={() => onClick(props.url, props.type)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const TaskBody = ({ task_url, task_name, quote = '', menu = () => null }) => {
  return (
    <div className="mb2 pv2 pl3 br2 bg-black-05">
      <div className="flex mb2 justify-between">
        <div className="f6 gray fw6">Task Created</div>
        <menu />
      </div>
      <div className="bg-white pa2 i f7 gray mt1 mr3 mb2">
        &quot;{quote}&quot;
      </div>
      <div className="pr3 mb2">
        <a href={task_url} className="f6 fw4 orange link">
          {task_name}
        </a>
      </div>
    </div>
  )
}

class CommentMessage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: props.message
    }

    this.messageBox = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.editing && this.props.editing) {
      this.resizeMessageBox()
    }
  }

  resizeMessageBox = () => {
    // this.messageBox.current.style.cssText = 'height:' + this.messageBox.current.scrollHeight + 'px'

    const field = this.messageBox.current
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

  onChangeMessage = event => {
    const target = event.target
    target.style.cssText = 'height:' + target.scrollHeight + 'px'
    this.setState({ message: event.target.value }, this.resizeMessageBox)
  }

  onEditCompleted = event => {
    const { id } = this.props
    this.props.onEditCompleted(id, { message: this.state.message })
  }

  onCancelEdit = event => {
    this.setState({ message: this.props.message })
    const { id } = this.props
    this.props.onEditCompleted(id, { message: this.props.message })
  }

  render() {
    const {
      id,
      sender,
      is_me,
      sent_at,
      resolved = false,
      reason = '',
      attachments = [],
      task_url = '',
      task_name = '',
      quote = '',
      onTogglePreview = (url, mime_type) => {},
      isMenuOpen = false,
      renderMenu,
      editing
    } = this.props

    const align = is_me == true ? 'justify-start' : 'justify-end'
    const { message } = this.state

    return (
      <React.Fragment>
        <div className={`ph3 mb3 mt1 flex ${align}`}>
          <div className={`pt1 mr2 ${!is_me && 'dn'}`}>
            <Avatar
              firstName={sender.first_name}
              lastName={sender.last_name}
              size={25}
              photoUrl={sender.photo}
            />
          </div>
          <div style={{ minWidth: '40%', maxWidth: '85%' }}>
            {editing && (
              <div>
                <textarea
                  ref={this.messageBox}
                  value={message}
                  className="f6 outline-0 pa1"
                  onChange={this.onChangeMessage}
                />
                <i
                  className="material-icons green icon--small icon--btn"
                  onClick={this.onEditCompleted}
                >
                  done
                </i>
                <i
                  className="material-icons green icon--small icon--btn"
                  onClick={this.onCancelEdit}
                >
                  close
                </i>
              </div>
            )}
            {!editing && task_url.length === 0 && (
              <CommentBody
                message={message}
                attachments={attachments}
                resolved={resolved}
                reason={reason}
                id={id}
                onClick={onTogglePreview}
                isMenuOpen={isMenuOpen}
                renderMenu={renderMenu}
              />
            )}
            {task_url.length > 0 && (
              <TaskBody
                task_url={task_url}
                task_name={task_name}
                quote={quote}
              />
            )}
            <div className="fw4 gray" style={{ fontSize: '10px' }}>
              <span className="orange">
                {sender.first_name} {sender.last_name}
              </span>
              , {formatDate(sent_at)} {formatTime(sent_at)}
            </div>
          </div>
          <div className={`pt1 ml2 ${is_me && 'dn'}`}>
            <Avatar
              firstName={sender.first_name}
              lastName={sender.last_name}
              size={25}
              photoUrl={sender.photo}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default CommentMessage
