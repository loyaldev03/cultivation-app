import React from 'react'
import Avatar from '../../utils/Avatar'
import { formatDate, formatTime } from '../../utils/DateHelper'

const ResolvedSegment = ({
  reason,
  resolutionNotes,
  resolvedByFirstName,
  resolvedByLastName,
  resolvedByPhoto,
  resolvedAt
}) => {
  return (
    <div className="ph3 pv3 bg-light-yellow">
      <div className="flex w-100">
        <div className="w-auto pv0 mr2">
          <Avatar
            firstName={resolvedByFirstName}
            lastName={resolvedByLastName}
            size={25}
            photoUrl={resolvedByPhoto}
          />
        </div>
        <div className="flex flex-column w-100">
          <div className="f6 fw6 green mt0 mb2 items-center flex justify-between">
            <div className="flex">
              <span>Resolved</span>
              <i
                className="material-icons ml1"
                style={{ fontSize: '18px', width: '20px' }}
              >
                checked
              </i>
            </div>

            <div className="f7 gray fw4">
              {formatDate(resolvedAt)}, {formatTime(resolvedAt)}
            </div>
          </div>
          <p className="f6 fw4 gray mt0 mb2">Reason: {reason}</p>
          <p className="f6 fw4 gray mt0 mb2">{resolutionNotes}</p>
        </div>
      </div>
    </div>
  )
}

export default ResolvedSegment
