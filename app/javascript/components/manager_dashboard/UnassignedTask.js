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
        <h3 className='f5 fw6 dark-grey'>Unassigned Task</h3>
        <div className="overflow-y-scroll" style={{ height: 280 + 'px' }}>
          <table className="w-100">
            <thead className="dark-grey">
              <tr className="tl mb2">
                <th className="w-40">Tasks</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th className="tc">Worker</th>
              </tr>
            </thead>
            <tbody>
              {ChartStore.data_unassigned_task.map(e => (
                <React.Fragment>
                  <tr>
                    <td className="f4 b">
                      <div className="mb3 mt3 dark-grey">Batch {e.batch}</div>
                    </td>
                  </tr>
                  {e.tasks.map((u, i) => (
                    <tr className="pa2 grey" key={i}>
                      <td className="w-40">{u.name}</td>
                      <td>{u.start_date}</td>
                      <td>{u.end_date}</td>
                      <td className="tc">
                        <a
                          href={`/cultivation/batches/${
                            u.batch_id
                          }?openTaskid=${u.id}`}
                        >
                          <span className="material-icons mb2 mt2 dark-grey">
                            person_add
                          </span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    )
  }
}
