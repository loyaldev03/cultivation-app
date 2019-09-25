import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import React, { lazy, Suspense } from 'react'
import classNames from 'classnames'
import { differenceInDays } from 'date-fns'
import { action, observable, computed, autorun } from 'mobx'
import { observer } from 'mobx-react'
import { SlidePanel } from '../../utils'
import TaskStore from '../tasks_setup/stores/NewTaskStore'
const NewTaskForm = lazy(() => import('./tasks/NewTaskForm'))

import {
  decimalFormatter,
  formatDate2,
  httpGetOptions,
  ActiveBadge,
  CheckboxSelect,
  HeaderFilter,
  Loading,
  ListingTable,
  TempTaskWidgets
} from '../../utils'

import TaskWidget from './tasks/TaskWidget'
import DashboardTaskStore from './tasks/DashboardTaskStore'

class ActiveTaskStore {
  @observable tasks = []
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable metadata = {}
  @observable searchTerm = ''
  @observable filter = {
    facility_id: '',
    page: 0,
    limit: 20,
    isShowDirectReport: true
  }
  @observable columnFilters = {}

  constructor() {
    autorun(
      () => {
        if (this.filter.facility_id) {
          if (this.searchTerm === null) {
            this.searchTerm = ''
          }
          this.loadActiveTasks(this.filter.isShowDirectReport)
        }
      },
      { delay: 700 }
    )
  }

  @action
  async loadActiveTasks(isShowDirectReport) {
    this.isLoading = true
    let url = `/api/v1/batches/active_tasks_agg?facility_id=${
      this.filter.facility_id
    }&isShowDirectReport=${isShowDirectReport}`
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
      limit: filter.limit,
      isShowDirectReport: filter.isShowDirectReport
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
        const nameLc = `${b.name}`.toLowerCase()
        const results = nameLc.includes(filterLc)
        return results
      })
    } else {
      return this.tasks
    }
  }
}

const activeTaskStore = new ActiveTaskStore()

@observer
class TasksDashboardApp extends React.Component {
  constructor(props) {
    super(props)
    DashboardTaskStore.loadTasks_dashboard(this.props.currentFacilityId)
  }
  state = {
    isShowDirectReport: true,
    showNewTaskPanel: false,
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
        Header: (
          <HeaderFilter
            title="Phase"
            accessor="phase"
            getOptions={() => {
              return [
                'clone',
                'veg1',
                'veg2',
                'flower',
                'harvest',
                'dry',
                'trim',
                'cure',
                'packaging'
              ]
            }}
            onUpdate={activeTaskStore.updateFilterOptions}
          />
        ),
        accessor: 'phase',
        className: 'pl3 ttc',
        minWidth: 90
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
        Header: (
          <HeaderFilter
            title="Status"
            accessor="work_status"
            getOptions={activeTaskStore.getUniqPropValues}
            onUpdate={activeTaskStore.updateFilterOptions}
          />
        ),
        accessor: 'work_status',
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
      facility_id: this.props.currentFacilityId,
      page: state.page,
      limit: state.pageSize,
      isShowDirectReport: this.state.isShowDirectReport
    })
    activeTaskStore.loadActiveTasks(this.state.isShowDirectReport)
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

  onShowTask = () => {
    this.setState({ showNewTaskPanel: true })
  }

  onShowAllTasks = () => {
    let toggle = !this.state.isShowDirectReport
    this.setState({ isShowDirectReport: toggle })
    activeTaskStore.loadActiveTasks(toggle)
  }

  render() {
    const { currentFacilityId, taskPermission } = this.props
    const { columns, showNewTaskPanel, isShowDirectReport } = this.state
    return (
      <React.Fragment>
        <SlidePanel
          width="500px"
          show={showNewTaskPanel}
          renderBody={props => (
            <Suspense fallback={<div />}>
              {Array.isArray(this.props.currentFacilityId) ? (
                ''
              ) : (
                <NewTaskForm
                  ref={form => (this.NewTaskForm = form)}
                  onClose={() => this.setState({ showNewTaskPanel: false })}
                  onSave={params => {
                    TaskStore.createNoBatchTask(params)
                    this.setState({ showNewTaskPanel: false })
                  }}
                  facilityId={this.props.currentFacilityId}
                />
              )}
            </Suspense>
          )}
        />
        <div className="pa4">
          <div className="pb4">
            {Array.isArray(this.props.currentFacilityId)
              ? ''
              : taskPermission.create && (
                  <div className="flex flex-row-reverse mb4">
                    <a className="btn btn--primary" onClick={this.onShowTask}>
                      Create new task
                    </a>
                  </div>
                )}
            <TaskWidget facility_id={currentFacilityId} />
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
            <div className="flex items-center justify-end pv2">
              <label className="grey ph2 f6 pointer" htmlFor="show_all_tasks">
                My direct report Only
              </label>
              <input
                className="toggle toggle-default"
                id="show_all_tasks"
                type="checkbox"
                value={isShowDirectReport}
                checked={isShowDirectReport}
                onChange={this.onShowAllTasks}
              />
              <label className=" mr2 toggle-button" htmlFor="show_all_tasks"/>
              <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
            </div>
            
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
      </React.Fragment>
    )
  }
}

export default TasksDashboardApp
