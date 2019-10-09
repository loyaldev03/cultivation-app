import isEmpty from 'lodash.isempty'
import React, { memo, useState, lazy, Suspense } from 'react'
import _ from 'lodash'
import ReactTable from 'react-table'
import treeTableHOC from './treeTableHOC'
import { ProgressBar } from '../utils'
import PeopleDashboardStore from './PeopleDashboardStore'
import { DefaultAvatar } from '../utils'
import LetterAvatar from '../utils/LetterAvatar'
import {
  decimalFormatter,
  CheckboxSelect,
  HeaderFilter,
  ActiveBadge,
  TempPackagesHistory,
  ListingTable,
  httpGetOptions
} from '../utils'
import { action, observable, computed, autorun } from 'mobx'
import { observer } from 'mobx-react'
const TreeTable = treeTableHOC(ReactTable)

const getProgressBarColor = value => {
  if (value < 50) {
    return 'bg-red'
  }
  if (value > 50 && value < 69) {
    return 'bg-yellow'
  }
  if (value > 70) {
    return 'bg-green'
  }
}
const dummyData = [
  {
    role_name: 'Gardener',
    total_workers: '10',
    user: 'Steven Alexander',
    photo_url:
      'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
    ontime_arrival_data: 64,
    task_on_time_data: 100,
    capacity_hours: 40,
    absents: 2,
    ot_hours: 5,
    reported_to: 'Gilbert Hawkins'
  },
  {
    role_name: 'Gardener',
    total_workers: '10',
    user: 'Maria Alexander',
    photo_url:
      'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
    ontime_arrival_data: 64,
    task_on_time_data: 100,
    capacity_hours: 40,
    absents: 2,
    ot_hours: 5,
    reported_to: 'Gilbert Hawkins'
  },
  {
    role_name: 'Finance',
    total_workers: '2',
    user: 'Steven Alexander',
    photo_url:
      'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
    ontime_arrival_data: 64,
    task_on_time_data: 100,
    capacity_hours: 40,
    absents: 2,
    ot_hours: 5,
    reported_to: 'Gilbert Hawkins'
  },
  {
    role_name: 'Trimmer',
    total_workers: '2',
    user: 'Gabs Alexander',
    photo_url:
      'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
    ontime_arrival_data: 64,
    task_on_time_data: 100,
    capacity_hours: 40,
    absents: 2,
    ot_hours: 5,
    reported_to: 'Gilbert Hawkins'
  }
]
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
  @observable columnFilters = {}

  constructor() {
    autorun(
      () => {
        if (this.searchTerm === null) {
          this.searchTerm = ''
        }
        this.loadActiveTasks()
      },
      { delay: 700 }
    )
  }

  @action
  async loadActiveTasks() {
    this.isLoading = true
    let url = `/api/v1/people/employee_list?facility_id=${
      this.filter.facility_id
    }`
    url += `&page=${this.filter.page}&limit=${this.filter.limit}&search=${
      this.searchTerm
    }`
    console.log(url)
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

  /* + column filters */
  isFiltered = record => {
    let f = Object.keys(this.columnFilters).find(key => {
      const filter = this.columnFilters[key].filter(x => x.value === false)
      return filter.find(x => x.label === record[key])
    })
    return f ? true : false
  }

  updateFilterOptions = (propName, filterOptions) => {
    const updated = {
      ...this.columnFilters,
      [propName]: filterOptions
    }
    this.columnFilters = updated
  }

  getUniqPropValues = propName => {
    return uniq(this.filteredList.map(x => x[propName]).sort())
  }
  /* - column filters */

  @computed
  get filteredList() {
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return this.tasks.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const filterLc = this.searchTerm.toLowerCase()
        const nameLc = `${b.user}`.toLowerCase()
        const rolesLc = `${b.role_name}`.toLowerCase()
        const results = nameLc.includes(filterLc) || rolesLc.includes(filterLc)
        return results
      })
    } else {
      return this.tasks
    }
  }
}

const activeTaskStore = new ActiveTaskStore()

@observer
class EmployeeListApp extends React.Component {
  constructor() {
    super()
    this.state = {
      data: dummyData,
      columns: [
        {
          headerClassName: 'pl3 tl',
          Header: 'Job Roles',
          accessor: 'role_name',
          className: 'dark-grey pl3 fw6',
          minWidth: 150,
          show: false
        },
        { accessor: 'photo_url', show: false},
        { accessor: 'last_name', show: false},
        {
          headerClassName: 'pl3 tl',
          Header: 'Name',
          accessor: 'first_name',
          minWidth: 200,
          className: 'dark-grey pl3 fw6',
          Cell: props => {
            return (
              <div className="flex items-center">
                {props.row['photo_url'] ? (
                  <div>
                    <img
                      src={props.row['photo_url']}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '18px'
                      }}
                      onError={e => {
                        e.target.onerror = null
                        e.target.src = DefaultAvatar
                      }}
                    />
                  </div>
                ) : (
                  <LetterAvatar
                    firstName={props.value}
                    lastName={props.row['last_name']}
                    size={36}
                    radius={18}
                  />
                )}
                <span className="f6 fw6 dark-grey ml2 w-20">{`${props.value} ${props.row['last_name']}`}</span>
              </div>
            )
          }
        },
        {
          headerClassName: 'pl3 tl',
          Header: 'Ontime Arrivals',
          accessor: 'ontime_arrival_data',
          className: 'dark-grey pl3 fw6',
          minWidth: 150,
          Cell: props => {
            return (
              <div className="flex items-center w-100">
                <ProgressBar
                  percent={props.value}
                  height={10}
                  className="w-60"
                  barColor={getProgressBarColor(props.value)}
                />
                <span className="f6 fw6 dark-grey ml2 w-20">
                  {props.value} %
                </span>
              </div>
            )
          }
        },
        {
          headerClassName: 'pl3 tl',
          Header: 'Tasks On Time',
          className: 'dark-grey pl3 fw6',
          accessor: 'task_on_time_data',
          minWidth: 150,
          Cell: props => {
            return (
              <div className="flex items-center w-100">
                <ProgressBar
                  percent={props.value}
                  height={10}
                  className="w-60 mr2"
                  barColor={getProgressBarColor(props.value)}
                />
                <span className="f6 fw6 dark-grey ml2 w-20">
                  {props.value} %
                </span>
              </div>
            )
          }
        },
        {
          headerClassName: 'pl3 tl',
          Header: 'Capacity/hrs',
          className: 'dark-grey pl3 fw6',
          accessor: 'capacity_hours',
          minWidth: 150,
          Cell: props => {
            return (
              <div className="flex items-center w-100">
                <ProgressBar
                  percent={props.value}
                  height={10}
                  className="w-60 mr2"
                  barColor={getProgressBarColor(props.value)}
                />
                <span className="f6 fw6 dark-grey ml2 w-20">
                  {props.value} %
                </span>
              </div>
            )
          }
        },
        {
          headerClassName: 'pl3 tl',
          Header: 'Absents',
          className: 'dark-grey pl3 fw6',
          accessor: 'absents',
          minWidth: 150,
          Cell: props => (
            <span className="">{decimalFormatter.format(props.value)}</span>
          )
        },
        {
          headerClassName: 'pl3 tl',
          Header: 'OT(Hours)',
          className: 'dark-grey pl3 fw6',
          accessor: 'ot_hours',
          minWidth: 150,
          Cell: props => (
            <span className="">{decimalFormatter.format(props.value)}</span>
          )
        },
        {
          headerClassName: 'pl3 tl',
          Header: 'Reported To',
          className: 'dark-grey pl3 fw6',
          accessor: 'reported_to',
          minWidth: 150
        }
      ]
    }
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
  onFetchData = (state, instance) => {
    activeTaskStore.setFilter({
      facility_id: this.props.currentFacilityId,
      page: state.page,
      limit: state.pageSize
    })
    activeTaskStore.loadActiveTasks()
  }

  render() {
    const { columns } = this.state
    return (
      <div className="pa4 mw1200">
        <div className="flex flex-row-reverse" />
        <div className="flex justify-between pb3">
          <input
            type="text"
            className="input w5"
            placeholder="Search"
            onChange={e => {
              activeTaskStore.searchTerm = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>

        <TreeTable
          data={activeTaskStore.filteredList}
          onFetchData={this.onFetchData}
          columns={columns}
          pivotBy={['role_name']}
          defaultPageSize={10}
          sortable={true}
          loading={activeTaskStore.isLoading}
          className="-highlight dashboard-pivot"
        />
        <br />
      </div>
    )
  }
}
export default EmployeeListApp
