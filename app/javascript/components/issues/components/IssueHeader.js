import React from 'react'
import Avatar from '../../utils/Avatar'
import { formatIssueNo } from './FormatHelper'
import { formatDate, formatTime } from '../../utils/DateHelper'

const renderSeverity = value => {
  if (value === 'high') {
    return (
      <div className="tc ttc">
        <i className="material-icons red" style={{ fontSize: '18px' }}>
          error
        </i>
      </div>
    )
  } else if (value === 'medium') {
    return (
      <div className="tc ttc">
        <i className="material-icons gold" style={{ fontSize: '18px' }}>
          warning
        </i>
      </div>
    )
  } else if (value === 'low') {
    return <div className="tc ttc purple f7">FYI</div>
  } else {
    return null
  }
}

const IssueHeader = ({
  reporterFirsName,
  reporterLastName,
  reporterPhotoUrl = '',
  issueNo,
  severity,
  createdAt = null,
  status,
  isArchived = false,
  onClose = () => {}
}) => {
  return (
    <div className="ph3 pt1 pb2 b--light-gray flex flex-column">
      <div className="flex w-100 pt2">
        <div className="w-auto">
          <Avatar
            firstName={reporterFirsName}
            lastName={reporterLastName}
            photoUrl={reporterPhotoUrl}
            size={25}
          />
        </div>
        <div className="pl2">
          { isArchived && <span class="f7 pv1 br1 gray">Archived</span> }
          <div className="flex items-center pt1">
            <div className="f6 fw6 dark-gray">
              ISSUE {formatIssueNo(issueNo)}
            </div>
            <div className="f6 fw6 ph1">&bull;</div>
            <div className="f7 fw6 green pr2 ttu">{status}</div>
            {renderSeverity(severity)}
          </div>

          {createdAt && (
            <div className="flex pt1">
              <div style={{ fontSize: '10px' }} className="fw4 gray">
                {formatDate(createdAt)}, {formatTime(createdAt)}
              </div>
            </div>
          )}
        </div>
      </div>

      <span className="rc-slide-panel__close-button dim" onClick={onClose}>
        <i className="material-icons mid-gray md-18">close</i>
      </span>
    </div>
  )
}

export default IssueHeader
