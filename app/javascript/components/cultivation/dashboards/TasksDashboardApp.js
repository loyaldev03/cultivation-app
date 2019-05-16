import 'babel-polyfill'
import isEmpty from 'lodash.isempty'
import React, { memo, useState } from 'react'
import classNames from 'classnames'
import { differenceInDays } from 'date-fns'
import { action, observable, computed, autorun } from 'mobx'
import { observer } from 'mobx-react'
import {
  decimalFormatter,
  formatDate2,
  httpGetOptions,
  ActiveBadge,
  CheckboxSelect,
  Loading,
  ListingTable,
  TempTaskWidgets
} from '../../utils'

class ActiveTaskStore {
  @observable tasks = []
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable metadata = {}
  @observable searchTerm = ''
  @observable filter = {
    facility_id: '',
    page: 0,
    limit: 20
  }

  constructor() {
    autorun(
      () => {
        if (this.filter.facility_id) {
          if (this.searchTerm === null) {
            this.searchTerm = ''
          }
          this.loadActiveTasks()
        }
      },
      { delay: 700 }
    )
  }

  @action
  async loadActiveTasks() {
    this.isLoading = true
    let url = `/api/v1/batches/active_tasks_agg?facility_id=${
      this.filter.facility_id
    }`
    url += `&page=${this.filter.page}&limit=${this.filter.limit}&search=${
      this.searchTerm
    }`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.tasks = response.data
        this.metadata = Object.assign({ pages: 0 }, response.metadata)
        this.isDataLoaded = true
      } else {
        this.tasks = []
        this.metadata = { pages: 0 }
        this.isDataLoaded = false
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  setFilter(filter) {
    this.filter = {
      facility_id: filter.facility_id,
      page: filter.page,
      limit: filter.limit
    }
  }

  @computed get filteredList() {
    return this.tasks
  }
}

const activeTaskStore = new ActiveTaskStore()

@observer
class TasksDashboardApp extends React.Component {
  state = {
    columns: [
      {
        accessor: 'batch_id',
        show: false
      },
      {
        headerClassName: 'tc',
        Header: '!',
        accessor: 'issue_count',
        width: 30,
        Cell: props =>
          props.value ? (
            <i className="material-icons md-16 red pointer">error</i>
          ) : null
      },
      {
        headerClassName: 'pl3 tl',
        Header: 'Task name',
        accessor: 'name',
        className: 'pl3 fw6',
        minWidth: 160,
        Cell: props => <span className="truncate">{props.value}</span>
      },
      {
        headerClassName: 'pl3 tl',
        Header: 'Phase',
        accessor: 'phase',
        className: 'pl3 ttc',
        minWidth: 70
      },
      {
        headerClassName: 'pl3 tl',
        Header: 'Batch ID',
        accessor: 'batch_name',
        className: 'pl3',
        minWidth: 128,
        Cell: props => (
          <a
            className="link grey truncate"
            href={`/cultivation/batches/${props.row.batch_id}`}
            title={props.row.batch_no}
          >
            {props.value}
          </a>
        )
      },
      {
        headerClassName: 'tl',
        Header: 'Start date',
        accessor: 'start_date',
        className: 'justify-end pr3',
        width: 88,
        Cell: props => formatDate2(props.value)
      },
      {
        headerClassName: 'tl',
        Header: 'End date',
        accessor: 'end_date',
        className: 'justify-end pr3',
        width: 88,
        Cell: props => formatDate2(props.value)
      },
      {
        headerClassName: 'tl',
        Header: 'Status',
        accessor: 'work_status',
        className: 'justify-center',
        width: 90,
        Cell: props => (
          <span
            className={classNames(`f7 fw6 ph2 pv1 ba br2 dib tc`, {
              'grey b--grey': props.value === 'not_started',
              'bg-orange b--orange white': props.value === 'started',
              'bg-green b--green white': props.value === 'done'
            })}
          >
            {props.value}
          </span>
        )
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Est. hours',
        accessor: 'estimated_hours',
        className: 'justify-end pr3',
        width: 110,
        Cell: props =>
          props.value ? decimalFormatter.format(props.value) : '--'
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Act. hours',
        accessor: 'actual_hours',
        className: 'justify-end pr3',
        width: 110
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Est. cost',
        accessor: 'estimated_cost',
        className: 'justify-end pr3',
        width: 110,
        Cell: props =>
          props.value ? decimalFormatter.format(props.value) : '--'
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Act. cost',
        accessor: 'actual_cost',
        className: 'justify-end pr3',
        width: 110
      },
      {
        headerClassName: 'tc',
        Header: 'Assigned to',
        accessor: 'workers',
        className: 'justify-center',
        minWidth: 150,
        Cell: props => {
          if (!isEmpty(props.value)) {
            return props.value.map(x => x.name)
          }
          return null
        }
      }
    ]
  }

  onFetchData = (state, instance) => {
    activeTaskStore.setFilter({
      facility_id: this.props.defaultFacilityId,
      page: state.page,
      limit: state.pageSize
    })
    activeTaskStore.loadActiveTasks()
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
    const { defaultFacilityId } = this.props
    const { columns } = this.state
    return (
      <div className="pa4 mw1200">
        <div className="pb4">
          <img src={TempTaskWidgets} className="w-100" />
        </div>
        <div className="flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search Tasks"
            onChange={e => {
              activeTaskStore.searchTerm = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        <div className="pv3">
          <ListingTable
            ajax={true}
            onFetchData={this.onFetchData}
            data={activeTaskStore.filteredList}
            pages={activeTaskStore.metadata.pages}
            columns={columns}
            isLoading={activeTaskStore.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default TasksDashboardApp
