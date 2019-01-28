import 'babel-polyfill'
import React from 'react'
import { ActiveBadge, formatDate2, } from '../../utils'

class BatchListTable extends React.Component {
  render() {
    const { batches, onDelete } = this.props
    return (
      <table className="ba br2 b--black-10 pv2 ph3 f6">
        <tbody>
          <tr>
            <th className="w5 pv2 ph3 tl ttu">Batch ID</th>
            <th className="w4 tr ph3 ttu">Start Date</th>
            <th className="w4 tr ph3 ttu">Harvest Date</th>
            <th className="w4 tr ph3 ttu">Active</th>
            <th />
          </tr>
          {batches.map(b => (
            <tr className="dim" key={b.batch_no}>
              <td className="pv2 ph3 tl ttu">
                <a className="link" href={`/cultivation/batches/${b.id}`}>
                  {b.batch_no}
                </a>
              </td>
              <td className="tr pv2 ph3">{formatDate2(b.start_date)}</td>
              <td className="tr pv2 ph3">
                {formatDate2(b.estimated_harvest_date)}
              </td>
              <td className="tr pv2 ph3">
                <ActiveBadge status={b.status} />
              </td>
              <td>
                <i
                  className="material-icons red pointer"
                  onClick={() => onDelete(b.id)}
                >
                  delete
                </i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

export default BatchListTable
