import React from 'react'
import { observer } from 'mobx-react'
import {
  ActiveBadge,
  CheckboxSelect,
  TempIssueWidgets,
  HeaderFilter,
  ListingTable
} from '../../utils'
import classNames from 'classnames'

import IssueStore from '../../issues/store/IssueStore'
import IssueByPriority from './issues/IssueByPriority'
import IssueByGroup from './issues/IssueByGroup'
import DashboardIssueStore from './issues/DashboardIssueStore'

@observer
class IssuesDashboard extends React.Component {
  constructor(props) {
    super(props)
    DashboardIssueStore.loadIssueByPriority(this.props.currentFacilityId)
    DashboardIssueStore.loadIssueByGroup(this.props.currentFacilityId)
  }
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
        Header: (
          <HeaderFilter
            title="Status"
            accessor="status"
            getOptions={IssueStore.getUniqPropValues}
            onUpdate={IssueStore.updateFilterOptions}
          />
        ),
        accessor: 'status',
        minWidth: 88,
        className: 'justify-center ttu',
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
        Header: (
          <HeaderFilter
            title="Priority"
            accessor="severity"
            getOptions={IssueStore.getUniqPropValues}
            onUpdate={IssueStore.updateFilterOptions}
          />
        ),
        accessor: 'severity',
        minWidth: 88,
        className: 'justify-center ttu',
        Cell: props => (
          <span
            className={classNames(`fw6 red`, {
              purple: props.value === 'severe',
              yellow: props.value === 'medium',
              red: props.value === 'high'
            })}
          >
            {props.value}
          </span>
        )
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

  onToggleColumns = (header, value) => {
    const column = this.state.columns.find(x => x.Header === header)
    if (column) {
      column.show = value
      this.setState({
        columns: this.state.columns.map(x =>
          x.Header === column.Header ? column : x
        )
      })
    }
  }

  render() {
    const { columns } = this.state
    return (
      <div className="pa4">
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
          <div className="flex h-50">
            <div className="w-50">
              <div
                className="ba b--light-gray pa3 bg-white br2 mr3"
                style={{ height: 420 + 'px' }}
              >
                <IssueByPriority />
              </div>
            </div>
            <div className="w-50">
              <div
                className="ba b--light-gray pa3 bg-white br2"
                style={{ height: 420 + 'px' }}
              >
                <IssueByGroup facility_id={this.props.currentFacilityId} />
              </div>
            </div>
          </div>
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
