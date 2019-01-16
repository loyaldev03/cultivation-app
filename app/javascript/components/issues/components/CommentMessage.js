import React from 'react'
import Avatar from '../../utils/Avatar.js'
import { formatDate, formatTime } from '../../utils/DateHelper'

const Preview = ({url, preview, type, filename = ''}) => {
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


const Thumbnail = ({url, preview, type, filename}) => {
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

const CommentMessage = ({
  sender_first_name,
  sender_last_name,
  sender_photo,
  sender_id,
  current_user_id,
  sent_at,
  message,
  quote = '',
  resolved = false,
  attachments = [],
}) => {
  const isMe = sender_id === current_user_id
  const align = isMe ? 'justify-end' : 'justify-start'
  return (
    <React.Fragment>
      <div className={`pl4 pr3 mb3 mt1 flex ${align}`}>
        <div className={`pt1 mr2 ${isMe && 'dn'}`}>
          <Avatar
            firstName={sender_first_name}
            lastName={sender_last_name}
            size={25}
            photoUrl={sender_photo}
          />
        </div>
        <div style={{ minWidth: '40%', maxWidth: '85%' }}>
          <div className="mb2 pv2 pl3 pr0 br2 bg-black-05">
            <div className="flex">
              <p className="f6 black-70 lh-title mt0 mb1 flex-auto">
                {message}
              </p>
              <span className="material-icons black-05 hover-gray ph1 pointer" style={{ fontSize: '18px'}}>more_vert</span>
            </div>
            { 
              attachments.length > 0 && (
                <div className="flex flex-wrap mt2 mb1">
                  { attachments.map((props) => <Preview key={props.url} {...props} />) }
                </div>)
            }
            { 
              // TODO: Refactor CommentMessage to TaskCreatedMessage so that 'quote' layout is not here.
              quote.length > 0 && (
                <div className="bg-white pa2 i f7 gray mt1 mr3">
                  { quote }
                </div>)
            }
          </div>

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
