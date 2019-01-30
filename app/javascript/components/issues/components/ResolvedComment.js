import React from 'react'
import { formatDate, formatTime } from '../../utils/DateHelper'
import Avatar from '../../utils/Avatar'

const ResolvedComment = ({
  reason,
  resolutionNotes,
  resolvedByFirstName,
  resolvedByLastName,
  resolvedByPhoto,
  resolvedAt,
  is_me = false
}) => {
  const align = is_me == true ? 'justify-start' : 'justify-end'

  return (
    <React.Fragment>
      <div className={`ph3 mb3 mt1 flex ${align}`}>
        <div className={`pt1 mr2 ${!is_me && 'dn'}`}>
          <Avatar
            firstName={resolvedByFirstName}
            lastName={resolvedByLastName}
            size={25}
            photoUrl={resolvedByPhoto}
          />
        </div>
        <div style={{ minWidth: '40%', maxWidth: '85%' }}>
          <div className="flex flex-column w-100 mb2 pv2 ph3 br2 bg-black-05">
            <div className="f6 fw6 green mt0 mb2 items-center flex">
              <div className="flex mr1">Resolved</div>
              <i
                className="material-icons"
                style={{ fontSize: '18px', width: '20px' }}
              >
                checked
              </i>
            </div>
            <p className="f6 fw4 gray mt0 mb2">Reason: {reason}</p>
            <p className="f6 fw4 gray mt0 mb2">{resolutionNotes}</p>
          </div>

          <div className="fw4 gray" style={{ fontSize: '10px' }}>
            <span className="orange">
              {resolvedByFirstName} {resolvedByLastName}
            </span>
            , {formatDate(resolvedAt)} {formatTime(resolvedAt)}
          </div>
        </div>
        <div className={`pt1 ml2 ${is_me && 'dn'}`}>
          <Avatar
            firstName={resolvedByFirstName}
            lastName={resolvedByLastName}
            size={25}
            photoUrl={resolvedByPhoto}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

export default ResolvedComment
