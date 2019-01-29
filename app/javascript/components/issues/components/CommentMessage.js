import React from 'react'
import { toJS } from 'mobx'
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
  renderMenu = () => null
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

const CommentMessage = ({
  id,
  sender,
  is_me,
  sent_at,
  message,
  resolved = false,
  reason = '',
  attachments = [],
  task_url = '',
  task_name = '',
  quote = '',
  onTogglePreview = (url, mime_type) => {},
  isMenuOpen = false,
  renderMenu
}) => {
  const align = is_me == true ? 'justify-start' : 'justify-end'

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
          {task_url.length === 0 && (
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
            <TaskBody task_url={task_url} task_name={task_name} quote={quote} />
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

export default CommentMessage
