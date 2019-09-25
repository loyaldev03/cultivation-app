import React from 'react'
import { observer } from 'mobx-react'
import {
  ActiveBadge,
  CheckboxSelect,
  TempIssueWidgets,
  HeaderFilter,
  ListingTable,
  formatDate,
  SlidePanel
} from '../../utils'
import classNames from 'classnames'
import IssueStore from '../../issues/store/IssueStore'
import IssueByPriority from './issues/IssueByPriority'
import IssueByGroup from './issues/IssueByGroup'
import DashboardIssueStore from './issues/DashboardIssueStore'
import getIssue from '../../issues/actions/getIssue'
import currentIssueStore from '../../issues/store/CurrentIssueStore'
import IssueSidebar from '../../issues/IssueSidebar2'

@observer
class IssuesDashboard extends React.Component {
  constructor(props) {
    super(props)
    DashboardIssueStore.loadIssueByPriority(this.props.currentFacilityId)
    DashboardIssueStore.loadIssueByGroup(this.props.currentFacilityId)
  }
  state = {
    issueSelected: '',
    showIssues: false,
    issue_batch_id: '',
    issue_facility_id: '',
    rowSelected: '',
    columns: [
      { accessor: 'id', show: false },
      { accessor: 'cultivation_batch.id', show: false },
      { accessor: 'cultivation_batch.facility_id', show: false },
      {
        headerClassName: 'tl',
        Header: 'Issue ID',
        accessor: 'issue_no',
        minWidth: 88,
        className: 'justify-center ttu',
        Cell: props => this.renderOpenIssue(props.row, props.value, 'black fw6')
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
        Cell: props => this.renderOpenIssue(props.row, props.value)
      },
      {
        headerClassName: 'tl',
        Header: 'Issue Description',
        accessor: 'description',
        minWidth: 130,
        Cell: props => <span className="truncate grey">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Task"
            accessor="task_name"
            getOptions={IssueStore.getUniqPropValues}
            onUpdate={IssueStore.updateFilterOptions}
          />
        ),
        accessor: 'task_name',
        minWidth: 150,
        Cell: props => this.renderOpenIssue(props.row, props.value)
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Group"
            accessor="issue_type"
            getOptions={IssueStore.getUniqPropValues}
            onUpdate={IssueStore.updateFilterOptions}
          />
        ),
        accessor: 'issue_type',
        minWidth: 120,
        Cell: props => this.renderOpenIssue(props.row, props.value)
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
              red: props.value === 'severe',
              yellow: props.value === 'high',
              green: props.value === 'medium',
              blue: props.value === 'low'
            })}
          >
            {props.value}
          </span>
        )
        // Cell: props => this.renderOpenIssue(props.row, props.value)
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Batch Name"
            accessor="cultivation_batch_name"
            getOptions={IssueStore.getUniqPropValues}
            onUpdate={IssueStore.updateFilterOptions}
          />
        ),
        accessor: 'cultivation_batch_name',
        className: '',
        minWidth: 130,
        Cell: props => this.renderOpenIssue(props.row, props.value)
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Issue Date"
            accessor="created_at"
            getOptions={IssueStore.getUniqPropValues}
            onUpdate={IssueStore.updateFilterOptions}
          />
        ),
        accessor: 'created_at',
        className: '',
        minWidth: 130,
        Cell: props => this.renderOpenIssue(props.row, props.value)
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            toLeft={true}
            title="Assigned to"
            accessor="assigned_to_name"
            getOptions={IssueStore.getUniqPropValues}
            onUpdate={IssueStore.updateFilterOptions}
          />
        ),
        accessor: 'assigned_to_name',
        className: '',
        minWidth: 130,
        Cell: props => this.renderOpenIssue(props.row, props.value)
      }
    ]
  }
  componentDidMount() {
    IssueStore.loadAllIssuesByManager(this.props.currentFacilityId)
  }

  onCloseSidebar = () => {
    this.setState({
      showIssues: false,
      issue_batch_id: '',
      issue_facility_id: '',
      rowSelected: ''
    })
  }

  renderOpenIssue = (record, value, className = 'grey') => {
    return (
      <a
        href="#"
        className={`link flex truncate ${className}`}
        onClick={event =>
          this.openSidebar(
            event,
            record.id,
            'details',
            record['cultivation_batch.id'],
            record['cultivation_batch.facility_id']
          )
        }
      >
        {value}
      </a>
    )
  }

  openSidebar = (event, id = null, mode = null, batch_id, facility_id) => {
    this.setState({
      issueSelected: id,
      showIssues: true,
      issue_batch_id: batch_id,
      rowSelected: id,
      issue_facility_id: facility_id
    })

    currentIssueStore.reset()
    currentIssueStore.mode = mode

    if (id) {
      getIssue(id)
    }

    event.preventDefault()
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
    const {
      columns,
      showIssues,
      issue_batch_id,
      issue_facility_id,
      rowSelected
    } = this.state
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
            idSelected={rowSelected}
          />
          <SlidePanel
            width="500px"
            show={showIssues}
            renderBody={props => (
              <IssueSidebar
                batch_id={issue_batch_id}
                facility_id={issue_facility_id}
                mode={currentIssueStore.mode}
                current_user_first_name={this.props.current_user_first_name}
                current_user_last_name={this.props.current_user_last_name}
                current_user_photo={this.props.current_user_photo}
                onClose={this.onCloseSidebar}
                // canUpdate={this.props.batchPermission.update}
              />
            )}
          />
        </div>
      </div>
    )
  }
}

export default IssuesDashboard
