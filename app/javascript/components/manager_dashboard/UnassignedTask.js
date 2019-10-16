import React from 'react'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import { formatDate } from '../utils/DateHelper'
import isEmpty from 'lodash.isempty'
import {Loading, NoData} from '../utils'

@observer
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <h3 className="f5 fw6 dark-grey">Unassigned Task</h3>
        <div className="overflow-y-scroll" style={{ height: '310px' }}>
          {ChartStore.unassigned_task_loaded ? (
            !isEmpty(ChartStore.data_unassigned_task) ? (
              <table>
                <tbody>
                  <tr className="grey tl">
                    <th>
                      <div className="mb2">Task Name</div>
                    </th>
                    <th>
                      <div className="mb2">Start Date</div>
                    </th>
                    <th>
                      <div className="mb2">End Date</div>
                    </th>
                  </tr>
                  {ChartStore.data_unassigned_task.map((e, y) => (
                    <tr className="grey mb3" key={y}>
                      <td className="w-60">
                        <div className="mb3">
                          <span className="f5 grey">{e.name}</span>
                          <br />
                          <span className="f7 mt1 grey b">{e.batch_name}</span>
                        </div>
                      </td>
                      <td className="f5 w-20">
                        <div className="mb3 mr3">{formatDate(e.start_date)}</div>
                      </td>
                      <td className="f5 w-20">
                        <div className="mb3">{formatDate(e.end_date)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
