import 'babel-polyfill'
import { observer } from 'mobx-react'
import { ActiveBadge, CheckboxSelect, TempIssueWidgets } from '../../utils'
import ListingTable from './ListingTable'

import IssueStore from '../../issues/store/IssueStore'

@observer
class IssuesDashboard extends React.Component {
  state = {
    columns: [
      { accessor: 'id', show: false },
      { accessor: 'cultivation_batch_id', show: false },
      {
        headerClassName: 'tl',
        Header: 'Issue ID',
        accessor: 'issue_no',
        minWidth: 88,
        className: 'justify-center ttu',
        Cell: props => <span className="truncate black fw6">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Status',
        accessor: 'status',
        className: 'justify-center ttu',
        minWidth: 88,
        Cell: props => <ActiveBadge status={props.value} />
      },
      {
        headerClassName: 'tl',
        Header: 'Issue Description',
        accessor: 'description',
        minWidth: 130,
        Cell: props => <span className="truncate black fw6">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Task',
        accessor: 'task.name',
        minWidth: 130,
        Cell: props => <span className="">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Group',
        accessor: 'issue_type',
        minWidth: 88,
        Cell: props => <span className="ttc">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Priority',
        accessor: 'severity',
        className: 'justify-center ttu',
        minWidth: 88,
        Cell: props => <span className="fw6 red">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Batch Name',
        accessor: 'cultivation_batch.name',
        className: '',
        minWidth: 130,
        Cell: props => <span className="">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Issue Date',
        accessor: 'created_at',
        className: '',
        minWidth: 130,
        Cell: props => <span className="">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Worker',
        accessor: 'assigned_to.display_name',
        className: '',
        minWidth: 130,
        Cell: props => <span className="">{props.value}</span>
      }
    ]
  }
  componentDidMount() {
    IssueStore.loadAllIssues()
  }

  onToggleColumns = e => {
    const opt = this.state.columns.find(x => x.Header === e.target.name)
    if (opt) {
      opt.show = e.target.checked
    }
    this.setState({
      columns: this.state.columns.map(x =>
        x.accessor === e.target.name ? opt : x
      )
    })
    e.stopPropagation()
  }

  render() {
    const { columns } = this.state
    return (
      <div className="pa4 mw1200">
        <div className="flex flex-row-reverse">
          <span className="f5 fw6">
            You have
            <span className="orange">
              {' '}
              {IssueStore.openIssuesCount} Open Issues
            </span>
          </span>
        </div>
        <div className="pv4">
          <img src={TempIssueWidgets} className="w-100" />
        </div>
        <div className="flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search Plants"
            onChange={e => {
              IssueStore.filter = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        <div className="pv3">
          <ListingTable
            data={IssueStore.filteredList}
            columns={columns}
            isLoading={IssueStore.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default IssuesDashboard
