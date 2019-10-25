import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import React, { memo, useState } from 'react'
import classNames from 'classnames'
import { differenceInDays } from 'date-fns'
import { action, observable, computed, autorun } from 'mobx'
import { observer } from 'mobx-react'
import { toast } from './../../utils/toast'
import {
  SlidePanel,
  SlidePanelFooter,
  SlidePanelHeader
} from '../../utils/SlidePanel'
import {
  longDate,
  InputBarcode,
  decimalFormatter,
  formatDate,
  formatDate2,
  httpGetOptions,
  httpPutOptions,
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
    //DashboardMetrcStore.loadMetrcs_info(this.props.facility_id)
  }
  state = {
    data: [],
    showEditor: false,
    columns: [
      { Header: 'ID', accessor: 'id', show: false },
      { Header: 'Tag', accessor: 'tag' },
      {
        Header: 'Date Applied',
        accessor: 'u_at',
        Cell: props => {
          return <span className="">{longDate(props.value)}</span>
        }
      },
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
        Header: 'Description',
        accessor: 'destroy_reason'
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
          }
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
    //console.log(data)
    disposeMetrcs(this.props.facility_id, data).then(({ status, data }) => {
      //const updateData = data.map(x => ({ id: x.id, ...x.attributes }))
      if (status == 200) {
        toast('Metrc Tag has been disposed', 'success')
        activeTaskStore.loadActiveTasks()
        this.onToggleSidebar()
        this.editor.reset()
      } else {
        toast('Metrc Not Exist', 'error')
      }

      //this.setState({ data: [...updateData, ...this.state.data] })
    })

    //DashboardMetrcStore.loadMetrcs_info(this.props.facility_id)
  }

  onFetchData = (state, instance) => {
    activeTaskStore.setFilter({
      facility_id: this.props.facility_id,
      page: state.page,
      limit: state.pageSize
    })
    //activeTaskStore.loadActiveTasks()
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
    const { metrc_permission } = this.props
    return (
      <div className="w-100 bg-white pa3">
        <div id="toast" className="toast" />
        <div className="flex mb4 mt2">
          <h1 className="mv0 f3 fw4 dark-gray  flex-auto">METRC Tags</h1>
          <div style={{ justifySelf: 'end' }}>
            {metrc_permission.create && (
              <React.Fragment>
                <button
                  className="pv2 ph3 bg-orange white bn br2 ttu link dim f6 fw6 pointer"
                  onClick={this.onToggleSidebar}
                >
                  Destroy Tag
                </button>
              </React.Fragment>
            )}
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
    tag: '',
    reason: ''
  }

  reset = () => {
    this.setState({
      tag: '',
      reason: ''
    })
  }

  onChange = event => {
    const key = event.target.name
    //console.log(key)
    this.setState({ [key]: event.target.value })
  }

  onChangeTag = () => {
    const key = this.inputTagId.value
    this.setState({ tag: this.inputTagId.value })
  }

  onSave = event => {
    // console.log('on save...')
    this.props.onSave({
      tag: this.state.tag,
      reason: this.state.reason
    })
  }

  render() {
    const { onClose } = this.props
    const { tag, reason } = this.state

    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader onClose={onClose} title="Destroy METRC tags" />
        <div className="flex flex-column flex-auto justify-between">
          <div className="pv3 ph4 flex flex-column">
            <div className="mb3 f6">
              <label className="f6 fw6 db mb1 gray ttc">Tag ID</label>

              <InputBarcode
                name="metrc_tag"
                className="w-100"
                value={tag}
                ref={input => (this.inputTagId = input)}
                onChange={this.onChangeTag}
              />
            </div>

            <div className="mb3 f6">
              <label className="f6 fw6 db mb1 gray ttc">Reason</label>
              <textarea
                name="reason"
                value={reason}
                style={{ height: '250px' }}
                onChange={this.onChange}
                className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              />
            </div>
          </div>
          <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
        </div>
      </div>
    )
  }
}

const disposeMetrcs = (facilityId, data) => {
  const url = `/api/v1/metrc/update_metrc_disposed?facility_id=${facilityId}`

  return fetch(url, httpPutOptions(data)).then(response => {
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
