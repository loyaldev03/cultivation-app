import React from 'react'
// import { formatAgo } from '../../utils'
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

const formatIssueNo = issueNo => {
  if (issueNo) {
    return `#${issueNo.toString().padStart(5, '0')}`
  } else {
    ('')
  }
}

const IssueList = React.memo(
  ({ onEdit, onDelete, issues = [], show = true }) => {
    if (!show) {
      return null
    }
    return (
      <div className="w-100 grey">
        <ul className="list pl0">
          {issues.map(x => {
            return (
              <li className="pv2 pointer" key={x.id} onClick={e => onEdit(x)}>
                <div className="pl2">
                  <div className="flex items-center">
                    <div className="f6 fw6 dark-gray">
                      ISSUE {formatIssueNo(x.issue_no)}
                    </div>
                    <div className="f6 fw6 ph1">&bull;</div>
                    <div className="f7 fw6 green pr2 ttu">{x.status}</div>
                    {renderSeverity(x.severity)}
                  </div>

                  {x.created_at && (
                    <div className="flex pt1">
                      <div style={{ fontSize: '10px' }} className="fw4 gray">
                        {formatDate(x.created_at)}, {formatTime(x.created_at)}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
)

export default IssueList
