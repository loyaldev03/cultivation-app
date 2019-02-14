import 'babel-polyfill'
import React from 'react'
import { ActiveBadge, formatDate2 } from '../../utils'
import { Tooltip } from 'react-tippy'

const MenuButton = ({ icon, text, onClick, className = '' }) => {
  return (
    <a
      className={`pa2 flex link dim pointer items-center ${className}`}
      onClick={onClick}
    >
      <i className="material-icons md-17 pr2">{icon}</i>
      <span className="pr2">{text}</span>
    </a>
  )
}

class BatchListTable extends React.Component {
  render() {
    const { batches, onDelete } = this.props
    return (
      <table className="ba br2 b--black-10 pv2 ph3 f6">
        <tbody>
          <tr>
            <th className="w4 pv2 ph3 tl ttu">Batch ID</th>
            <th className="w4 pv2 ph3 tl ttu">Strains</th>
            <th className="w3 pv2 ph3 tr ttu">Quantity</th>
            <th className="w4 tr ph3 ttu">Start Date</th>
            <th className="w4 tr ph3 ttu">Harvest Date</th>
            <th className="w4 tr ph3 ttu">Active</th>
            <th width="7%" />
          </tr>
          {batches.map(b => (
            <tr className="dim batch-row" key={b.batch_no}>
              <td className="pv2 ph3 tl ttu">
                <a className="link" href={`/cultivation/batches/${b.id}`}>
                  {b.batch_no}
                </a>
              </td>
              <td className="ph3">{b.strain_name}</td>
              <td className="ph3 tr">{b.quantity}</td>
              <td className="tr pv2 ph3">{formatDate2(b.start_date)}</td>
              <td className="tr pv2 ph3">
                {formatDate2(b.estimated_harvest_date)}
              </td>
              <td className="tr pv2 ph3">
                <ActiveBadge status={b.status} />
              </td>
              <td>
                {b.status !== 'ACTIVE' ? (
                  <Tooltip
                    interactive
                    position="bottom"
                    trigger="click"
                    theme="light"
                    html={
                      <div className="bg-white f6 flex">
                        <div className="db shadow-4">
                          <MenuButton
                            icon="delete_outline"
                            text="Delete Task"
                            className="red"
                            onClick={() => onDelete(b.id)}
                          />
                        </div>
                      </div>
                    }
                  >
                    <i className={'pointer material-icons show-on-batch'}>
                      more_horiz
                    </i>
                  </Tooltip>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

export default BatchListTable
