import React from 'react'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import { TempHomeUnassignTask } from '../utils'

@observer
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <h3 className="f5 fw6 dark-grey">Unassigned Task</h3>
        <div className="overflow-y-scroll" style={{ height: 320 + 'px' }}>
          <table className="w-100">
            <thead className="grey">
              <tr className="tl mb2">
                <th className="w-40">Tasks</th>
                <th>Start Date</th>
                <th>End Date</th>
                {/* <th className="tc">Worker</th> */}
              </tr>
            </thead>
            <tbody>
              {ChartStore.unassigned_task ? (
                ChartStore.data_unassigned_task.map((e, y) => (
                  <React.Fragment>
                    <tr key={y}>
                      <td className="f4 b">
                        <div className="mb3 mt2 dark-grey" key={`ut_${y}`}>
                          Batch {e.batch}
                        </div>
                      </td>
                    </tr>
                    {e.tasks.map((u, i) => (
                      <tr className="grey" key={i}>
                        <td className="w-50 ">
                          <div className="fw6 mb3 dark-grey" key={i}>
                            {u.name}
                          </div>
                        </td>
                        <td>
                          <div className="fw6 mb3" key={i}>
                            {u.start_date}
                          </div>
                        </td>
                        <td>
                          <div className="fw6 mb3" key={i}>
                            {u.end_date}
                          </div>
                        </td>
                        {/* <td className="tc">
                          <a
                            href={`/cultivation/batches/${
                              u.batch_id
                            }?openTaskid=${u.id}`}
                          >
                            <span className="material-icons mb2 mt2 dark-grey">
                              person_add
                            </span>
                          </a>
                        </td> */}
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr className="grey pt2">
                  <td>No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    )
  }
}
