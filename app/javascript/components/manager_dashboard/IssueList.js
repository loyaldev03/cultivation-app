import React from 'react'
import { TempHomeIssue } from '../utils'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import { formatIssueNo } from '../issues/components/FormatHelper'

@observer
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-between mb2" >
          <h1 className="f5 fw6">Issues</h1>
          <input placeholder="Filter Issue" className="input w6"  
            onChange={e => {
              ChartStore.filter = e.target.value
            }}>
          </input>
        </div>
       
        
        <div className="overflow-y-scroll" style={{ height: 280 + 'px' }}>
          {ChartStore.filterIssueList.map(e => (
            <React.Fragment>
              <div className="mb4">
                <a className="no-underline" href={`/cultivation/batches/${e.batch_id}/issues`}>
                  <span className="f5 grey">Issue {formatIssueNo(e.issue_no)}, Batch {e.batch} </span>
                  <span className="f7 green ttu">{e.status}</span>
                  <br></br>
                  <span className="f7 mt1 grey">{e.created_at}</span>
                  <br></br> 
                  <span className="black">{e.title}</span>
                </a>
              </div>
            </React.Fragment>
          ))}
        </div>

      </React.Fragment>
    )
  }
}
