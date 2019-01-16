import React from 'react'
import Avatar from '../../utils/Avatar.js'
import { formatDate, formatTime } from '../../utils/DateHelper'

const CommentMessage = ({
  sender_first_name, 
  sender_last_name, 
  sender_photo, 
  sender_id,
  current_user_id, 
  sent_at, 
  message, 
  quote= '',
  resolved= false
}) => {

  const isMe = sender_id === current_user_id
  const align = isMe ? 'justify-end' : 'justify-start'
  return (
    <React.Fragment>
      <div className={`pl4 pr3 mb3 flex ${align}`}>
        <div className={`pt1 mr2 ${isMe && 'dn'}`}>
          <Avatar firstName={sender_first_name} lastName={sender_last_name} size={25} />
        </div>
        <div  style={{ minWidth: '40%' }}>
          <div className="f6 dark-gray pv2 ph3 br2 bg-black-05 mb2">
            {message}
          </div>
          
          <div className="fw4 gray" style={{ fontSize: '10px' }}>
            <span className="orange">{sender_first_name} {sender_last_name}</span>, {formatDate(sent_at)} {formatTime(sent_at)}
          </div>
          
        </div>
        <div className={`pt1 ml2 ${!isMe && 'dn'}`}>
          <Avatar firstName={sender_first_name} lastName={sender_last_name} size={25} />
        </div>
      </div>
      
    </React.Fragment>
  )
}

export default CommentMessage