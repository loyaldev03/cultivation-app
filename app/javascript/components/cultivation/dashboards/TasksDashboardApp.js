import 'babel-polyfill'
import React, { memo, useState } from 'react'
import classNames from 'classnames'
import { differenceInDays } from 'date-fns'
import { action, observable, computed } from 'mobx'
import { observer } from 'mobx-react'
import {
  decimalFormatter,
  formatDate2,
  httpGetOptions,
  ActiveBadge,
  CheckboxSelect,
  Loading,
  TempTaskWidgets
} from '../../utils'
import ListingTable from './ListingTable'

class ActiveTaskStore {
  @observable tasks = []
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable pagy = {}

  @action
  async loadActiveTasks({ page, pageSize }) {
    this.isLoading = true
    const url = `/api/v1/batches/active_tasks?page=${page +
      1}&pageSize=${pageSize}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.tasks = response.data.map(x => x.attributes)
        this.pagy = response.pagy
        this.isDataLoaded = true
      } else {
        this.tasks = []
        this.pagy = {}
        this.isDataLoaded = false
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
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
        headerClassName: 'tl',
        Header: 'WBS',
        accessor: 'wbs',
        width: 78
      },
      {
        headerClassName: 'pl3 tl',
        Header: 'Task',
        accessor: 'name',
        className: 'pl3 fw6',
        minWidth: 138,
        Cell: props => (
          <a
            className="link dark-grey truncate"
            href={`/cultivation/batches/${props.row.cultivation_batch_id}`}
          >
            {props.value}
          </a>
        )
      },
      {
        headerClassName: 'tl',
        Header: 'Start Date',
        accessor: 'start_date',
        className: 'justify-end pr3',
        width: 88,
        Cell: props => formatDate2(props.value)
      },
      {
        headerClassName: 'tl',
        Header: 'End Date',
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
        Header: 'Est. Hours',
        accessor: 'estimated_hours',
        className: 'justify-end pr3',
        width: 110,
        Cell: props =>
          props.value ? decimalFormatter.format(props.value) : '--'
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Hrs to date',
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
        Header: 'Cost to date',
        accessor: 'actual_cost',
        className: 'justify-end pr3',
        width: 110
      }
    ]
  }

  onFetchData = (state, instance) => {
    activeTaskStore.loadActiveTasks(state)
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
              activeTaskStore.filter = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        <div className="pv3">
          <ListingTable
            ajax={true}
            onFetchData={this.onFetchData}
            data={activeTaskStore.filteredList}
            pages={activeTaskStore.pagy.pages}
            columns={columns}
            isLoading={activeTaskStore.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default TasksDashboardApp
