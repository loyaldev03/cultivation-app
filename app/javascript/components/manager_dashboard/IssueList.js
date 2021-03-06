import React from 'react'
import { TempHomeIssue } from '../utils'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import { formatIssueNo } from '../issues/components/FormatHelper'
import { formatDate, formatTime } from '../utils/DateHelper'
import isEmpty from 'lodash.isempty'
import { Loading, NoData } from '../utils'

@observer
export default class IssueList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-between mb2">
          <h1 className="f5 fw6 dark-grey">Issues</h1>
          <input
            placeholder="Filter Issue"
            className="input w6"
            onChange={e => {
              ChartStore.filter = e.target.value
            }}
          />
        </div>

        <div className="overflow-y-scroll" style={{ height: 320 + 'px' }}>
          {ChartStore.issue_list_loaded ? (
            !isEmpty(ChartStore.filterIssueList) ? (
              <React.Fragment>
                {ChartStore.filterIssueList.map((e, y) => (
                  <div className="mb4" key={y}>
                    <a
                      className="no-underline"
                      href={`/cultivation/batches/${
                        e.cultivation_batch_id
                      }/issues`}
                    >
                      <span className="f5 grey">
                        Issue {formatIssueNo(e.issue_no)}, Batch {e.batch_no}{' '}
                      </span>
                      <span className="f7 green ttu">{e.status}</span>
                      <br />
                      <span className="f7 mt1 grey">
                        {formatDate(e.c_at)}, {formatTime(e.c_at)}
                      </span>
                      <br />
                      <span className="dark-grey">{e.title}</span>
                    </a>
                  </div>
                ))}
              </React.Fragment>
            ) : (
              <NoData />
            )
          ) : (
            <Loading />
          )}
        </div>
      </React.Fragment>
    )
  }
}
