import React from 'react'
// import { formatAgo } from '../../utils'

const IssueList = React.memo(({ onEdit, onDelete, issues = [], show = true }) => {
  if (!show) {
    return null
  }
  return (
    <div className="w-100 grey">
      <ul className="list pl0">
        {issues.map(x => {
          return (
            <li className="pv2 pointer" key={x.id} onClick={(e) => onEdit(x)}>
              <div className='flex justify-between'>
                <div className='f6 dark-gray'>
                  Issue #{x.issue_no}
                </div>
                <div className='f6 dark-gray items-right'>
                  {x.tags.length > 0 &&
                    x.tags.map((tag, index) => (
                      <span className="bg-green ba white f7 fw4 ph1 br2 ml1" key={index}>
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
              <span className='f6 dark-gray'>
                {x.title}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
})

export default IssueList
