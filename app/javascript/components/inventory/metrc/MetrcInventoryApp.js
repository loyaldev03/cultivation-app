import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import React, { memo, useState } from 'react'
import classNames from 'classnames'
import { differenceInDays } from 'date-fns'
import { action, observable, computed, autorun } from 'mobx'
import { observer } from 'mobx-react'
import {
  SlidePanel,
  SlidePanelFooter,
  SlidePanelHeader
} from '../../utils/SlidePanel'
import {
  decimalFormatter,
  formatDate2,
  httpGetOptions,
  ActiveBadge,
  CheckboxSelect,
  HeaderFilter,
  Loading,
  ListingTable,
  formatAgo,
  TempTaskWidgets,
  httpPostOptions
} from '../../utils'
import DashboardMetrcStore from './DashboardMetrcStore'
import classnames from 'classnames'

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
    let url = `/api/v1/metrc?facility_id=${this.filter.facility_id}`
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
        const nameLc = `${b.tag}`.toLowerCase()
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
class MetrcInventoryApp extends React.Component {
  constructor(props) {
    super(props)
    DashboardMetrcStore.loadMetrcs_info(this.props.facility_id)
  }
  state = {
    data: [],
    showEditor: false,
    columns: [
      { Header: 'ID', accessor: 'id', show: false },
      { Header: 'Tag', accessor: 'tag' },
      { Header: 'Type', accessor: 'tag_type' },
      {
        Header: 'Status',
        accessor: 'status',
        width: 200,
        Cell: props => {
          return (
            <span
              className={classnames('ttc', {
                grey: props.value === 'assigned',
                green: props.value === 'available'
              })}
            >
              {props.value === 'assigned' ? 'used' : props.value}
            </span>
          )
        }
      },
      {
        Header: 'Action',
        accessor: 'id',
        Cell: props => {
          if (
            props.row['reported_to_metrc'] == false &&
            props.row['status'] == 'disposed'
          ) {
            return (
              <a
                href={`/api/v1/metrc/update_metrc_reported?facility_id=${
                  this.props.facility_id
                }&&metrc_id=${props.value}`}
                className="link f7 fw6 ph2 pv1 ba br2 dib tc bg-green b--green white"
                onClick={this.onUpdateConfirm}
              >
                Mark as Reported to Metrc
              </a>
            )
          } else if (
            props.row['reported_to_metrc'] == false &&
            props.row['status'] == 'available'
          ) {
            return (
              <a
                href={`/api/v1/metrc/update_metrc_disposed?facility_id=${
                  this.props.facility_id
                }&&metrc_id=${props.value}`}
                className="link f7 fw6 ph2 pv1 ba br2 dib tc bg-orange b--orange white"
              >
                Disposed
              </a>
            )
          }
        }
      },

      {
        Header: 'Reported',
        accessor: 'reported_to_metrc',
        Cell: props => {
          return <span className="">{props.value ? 'Yes' : 'No'}</span>
        }
      },

      {
        Header: 'Last Update',
        accessor: 'u_at',
        Cell: props => {
          return <span className="">{formatAgo(props.value)}</span>
        }
      }
    ]
  }

  onToggleSidebar = () => {
    this.setState({ showEditor: !this.state.showEditor })
  }

  onUpdateConfirm = e => {
    if (confirm('Mark as report?')) {
    } else {
      e.preventDefault()
    }
  }

  onSave = data => {
    bulkCreateMetrcs(this.props.facility_id, data).then(({ status, data }) => {
      const newData = data.map(x => ({ id: x.id, ...x.attributes }))
      this.setState({ data: [...newData, ...this.state.data] })
    })
    this.onToggleSidebar()
    this.editor.reset()
    DashboardMetrcStore.loadMetrcs_info(this.props.facility_id)
  }

  onFetchData = (state, instance) => {
    activeTaskStore.setFilter({
      facility_id: this.props.facility_id,
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
    const { columns, showEditor } = this.state
    return (
      <div className="w-100 bg-white pa3">
        <div className="flex mb4 mt2">
          <h1 className="mv0 f3 fw4 dark-gray  flex-auto">METRC Tags</h1>
          <div style={{ justifySelf: 'end' }}>
            <button
              className="pv2 ph3 bg-orange white bn br2 ttu link dim f6 fw6 pointer"
              onClick={this.onToggleSidebar}
            >
              Add item
            </button>
          </div>
        </div>

        <SlidePanel
          width="500px"
          show={showEditor}
          renderBody={props => (
            <MetricEditor
              ref={ref => (this.editor = ref)}
              onSave={this.onSave}
              onClose={this.onToggleSidebar}
            />
          )}
        />

        <div className="flex justify-between pb3">
          <input
            type="text"
            className="input w5"
            placeholder="Search Tag ID"
            onChange={e => {
              activeTaskStore.searchTerm = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>

        <ListingTable
          ajax={true}
          onFetchData={this.onFetchData}
          data={activeTaskStore.filteredList}
          pages={activeTaskStore.metadata.pages}
          columns={columns}
          isLoading={activeTaskStore.isLoading}
        />
      </div>
    )
  }
}

class MetricEditor extends React.Component {
  state = {
    metrcs: '',
    tag_type: 'plant'
  }

  reset = () => {
    this.setState({
      metrcs: '',
      tag_type: 'plant'
    })
  }

  onChange = event => {
    const key = event.target.name
    this.setState({ [key]: event.target.value })
  }

  onSave = event => {
    // console.log('on save...')
    this.props.onSave({
      metrcs: this.state.metrcs,
      tag_type: this.state.tag_type
    })
  }

  render() {
    const { onClose } = this.props
    const { metrcs, tag_type } = this.state

    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader onClose={onClose} title="Add METRC tags" />
        <div className="flex flex-column flex-auto justify-between">
          <div className="pv3 ph4 flex flex-column">
            <div className="mb3 f6">
              <label className="f6 fw6 db mb1 gray ttc">Tag IDs</label>
              <textarea
                name="metrcs"
                value={metrcs}
                style={{ height: '250px' }}
                onChange={this.onChange}
                className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              />
            </div>

            <div className="mb3 f6">
              <label className="f6 fw6 db mb1 gray ttc">Tag type</label>
              <div className="w-100 flex  mt2">
                <label className="mr4">
                  <input
                    type="radio"
                    name="tag_type"
                    value="plant"
                    checked={tag_type == 'plant'}
                    onChange={this.onChange}
                  />
                  <span className="ml2">Plant</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="tag_type"
                    value="package"
                    checked={tag_type == 'package'}
                    onChange={this.onChange}
                  />
                  <span className="ml2">Package</span>
                </label>
              </div>
            </div>
          </div>
          <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
        </div>
      </div>
    )
  }
}

const bulkCreateMetrcs = (facilityId, data) => {
  const url = `/api/v1/metrc/bulk_create/${facilityId}`

  return fetch(url, httpPostOptions(data)).then(response => {
    return response.json().then(data => {
      // console.log(data)
      return {
        status: response.status,
        data: data.data
      }
    })
  })
}

export default MetrcInventoryApp
