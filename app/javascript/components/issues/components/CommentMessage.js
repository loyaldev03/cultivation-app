import React from 'react'
import Avatar from '../../utils/Avatar.js'
import { formatDate, formatTime } from '../../utils/DateHelper'

const Preview = ({ url, preview, type, filename = '' }) => {
  return (
    <div
      src="/"
      mime_type={type}
      style={{ width: 48, height: 48 }}
      className="mr1 overflow-hidden relative hover-photo mb1"
    >
      <Thumbnail url={url} preview={preview} type={type} filename={filename} />
      <div
        className="zoom-btn"
        style={{ width: 48, height: 48 }}
        url={url}
        /* onClick={() => this.onTogglePreview(x.url, x.mime_type)} */
      >
        <i className="material-icons absolute">search</i>
      </div>
    </div>
  )
}

const Thumbnail = ({ url, preview, type, filename }) => {
  if (type.startsWith('image')) {
    return (
      <div
        style={{
          width: 48,
          height: 48,
          background: `url(${preview}) no-repeat center center`,
          backgroundSize: 'cover'
        }}
      />
    )
  } else {
    return (
      <div
        className="gray overflow-hidden f7 bg-white"
        style={{
          width: 48,
          height: 48
        }}
      >
        VID - {filename}
      </div>
    )
  }
}

const CommentBody = ({
  id,
  message,
  attachments = [],
  resolved = false,
  reason = ''
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
        <p className="f6 black-70 lh-title mt0 mb1 flex-auto">{message}</p>

        <span
          className="material-icons black-05 hover-gray ph1 pointer"
          style={{ fontSize: '18px' }}
        >
          more_vert
        </span>
      </div>
      {reason.length > 0 && (
        <p className="f6 black-70 lh-title mt0 mb1 flex-auto pr3">
          Reason: {reason}
        </p>
      )}
      {attachments.length > 0 && (
        <div className="flex flex-wrap mt2 mb1">
          {attachments.map(props => (
            <Preview key={`${id}.${props.url}`} {...props} />
          ))}
        </div>
      )}
    </div>
  )
}

const TaskBody = ({ task_url, task_name, quote = '' }) => {
  return (
    <div className="mb2 pv2 pl3 br2 bg-black-05">
      <div className="flex mb2 justify-between">
        <div className="f6 gray fw6">Task Created</div>
        <span
          className="material-icons black-05 hover-gray ph1 pointer"
          style={{ fontSize: '18px' }}
        >
          more_vert
        </span>
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
  sender_first_name,
  sender_last_name,
  sender_photo,
  sender_id,
  current_user_id,
  sent_at,
  message,
  resolved = false,
  reason = '',
  attachments = [],
  task_url = '',
  task_name = '',
  quote = ''
}) => {
  const isMe = sender_id === current_user_id
  const align = isMe ? 'justify-end' : 'justify-start'
  return (
    <React.Fragment>
      <div className={`ph3 mb3 mt1 flex ${align}`}>
        <div className={`pt1 mr2 ${isMe && 'dn'}`}>
          <Avatar
            firstName={sender_first_name}
            lastName={sender_last_name}
            size={25}
            photoUrl={sender_photo}
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
            />
          )}
          {task_url.length > 0 && (
            <TaskBody task_url={task_url} task_name={task_name} quote={quote} />
          )}
          <div className="fw4 gray" style={{ fontSize: '10px' }}>
            <span className="orange">
              {sender_first_name} {sender_last_name}
            </span>
            , {formatDate(sent_at)} {formatTime(sent_at)}
          </div>
        </div>
        <div className={`pt1 ml2 ${!isMe && 'dn'}`}>
          <Avatar
            firstName={sender_first_name}
            lastName={sender_last_name}
            size={25}
            photoUrl={sender_photo}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

export default CommentMessage
