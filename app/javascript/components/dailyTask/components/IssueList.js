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
  ({ onShow, onDelete, issues = [], show = true }) => {
    if (!show) {
      return null
    }
    return (
      <div className="w-100 grey">
        <ul className="list pl0 pb0">
          {issues.map(x => {
            return (
              <li
                className="pt2 pb3 pointer bb b--black-10"
                key={x.id}
                onClick={e => onShow(x)}
              >
                <div className="f5 fw4 dark-gray pb1">{x.title}</div>

                <div className="flex items-center justify-end">
                  <div className="f7 fw6 silver">
                    ISSUE {formatIssueNo(x.issue_no)}
                  </div>
                  <div className="f6 fw6 ph1">&bull;</div>
                  <div className="f7 fw6 green pr2 ttu">{x.status}</div>
                  {renderSeverity(x.severity)}
                </div>

                {x.created_at && (
                  <div className="flex pt1 justify-end">
                    <div style={{ fontSize: '10px' }} className="fw4 gray">
                      {formatDate(x.created_at)}, {formatTime(x.created_at)}
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
)

export default IssueList
