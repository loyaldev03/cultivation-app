import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import React, { memo, useState, lazy, Suspense } from 'react'
import { differenceInDays } from 'date-fns'
import { action, observable, computed, autorun } from 'mobx'
import { observer } from 'mobx-react'
import {
  decimalFormatter,
  formatDate2,
  ActiveBadge,
  CheckboxSelect,
  HeaderFilter,
  Loading,
  ListingTable,
  httpGetOptions,
  GROWTH_PHASE,
  TempBatchWidgets
} from '../utils'

class FacilitySummaryStore {
  @observable rooms = []
  @observable isLoading = false
  @observable filter = ''
  @observable columnFilters = {}

  @action
  async loadRooms(facility_id) {
    this.isLoading = true
    const url = `/api/v1/facilities/${facility_id}/current_trays_summary`
    try {
      const res = await (await fetch(url, httpGetOptions)).json()
      if (res && res.data) {
        this.rooms = res.data
      } else {
        this.rooms = []
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @computed
  get filteredList() {
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return this.rooms.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const filterLc = this.filter.toLowerCase()
        const nameLc = `${b.room_name}${b.room_code}${b.purpose}`.toLowerCase()
        const results = nameLc.includes(filterLc)
        return results
      })
    } else {
      return this.rooms
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
}

const Store = new FacilitySummaryStore()

@observer
class RoomsDashboardApp extends React.Component {
  state = {
    columns: [
      { accessor: 'id', show: false },
      { accessor: 'room_has_sections', show: false },
      {
        headerClassName: 'pl3 tl',
        Header: 'Room Name',
        accessor: 'room_name',
        className: 'dark-grey pl3 fw6',
        minWidth: 128,
        Cell: props => (
          <span className="link dark-grey truncate">{props.value}</span>
        )
      },
      {
        headerClassName: 'tl',
        Header: 'Room ID',
        accessor: 'room_code',
        className: '',
        minWidth: 100
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Purpose"
            accessor="purpose"
            getOptions={Store.getUniqPropValues}
            onUpdate={Store.updateFilterOptions}
          />
        ),
        accessor: 'purpose',
        className: 'ttc',
        minWidth: 100
      },
      {
        headerClassName: 'tl',
        Header: 'Plant Capacity',
        accessor: 'total_capacity',
        className: 'justify-end pr3',
        width: 120,
        Cell: props => (this.showValue(props) ? props.value : '')
      },
      {
        headerClassName: 'tl',
        Header: 'Total Used',
        accessor: 'planned_capacity',
        className: 'justify-end pr3',
        width: 100,
        Cell: props => (this.showValue(props) ? props.value : '')
      },
      {
        headerClassName: 'tl',
        Header: 'Total Available',
        accessor: 'available_capacity',
        className: 'justify-end pr3',
        width: 120,
        Cell: props => (this.showValue(props) ? props.value : '')
      },
      {
        headerClassName: 'tl',
        Header: '# of Sections',
        accessor: 'section_count',
        className: 'justify-end pr3',
        width: 98,
        Cell: props => {
          if (this.showValue(props)) {
            return props.row.room_has_sections ? props.value : 'n/a'
          } else {
            return ''
          }
        }
      },
      {
        headerClassName: 'tr pr3',
        Header: '# of Rows',
        accessor: 'row_count',
        className: 'justify-end pr3',
        width: 96,
        Cell: props => (this.showValue(props) ? props.value : '')
      },
      {
        headerClassName: 'tr pr3',
        Header: '# of Shelves',
        accessor: 'shelf_count',
        className: 'justify-end pr3',
        width: 100,
        Cell: props => (this.showValue(props) ? props.value : '')
      },
      {
        headerClassName: 'tr pr3',
        Header: '# of Trays',
        accessor: 'tray_count',
        className: 'justify-end pr3',
        width: 96,
        Cell: props => (this.showValue(props) ? props.value : '')
      }
    ]
  }

  showValue(props) {
    const room_purpose = props.row.purpose.split(',')[0]
    return Object.values(GROWTH_PHASE).includes(room_purpose)
  }

  componentDidMount() {
    Store.loadRooms(this.props.currentFacilityId)
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
    const { currentFacilityId } = this.props
    const { columns } = this.state
    return (
      <div className="pa4 mw1200">
        <div className="flex flex-row-reverse" />
        <div className="mt4 flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search Room"
            onChange={e => {
              Store.filter = e.target.value
            }}
          />
          <div className="flex items-center">
            <a
              href={`/facility_setup/rooms_info?facility_id=${currentFacilityId}`}
              className="btn btn--primary mh3"
            >
              Create new room
            </a>
            <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
          </div>
        </div>
        <div className="pv3">
          <ListingTable
            data={Store.filteredList}
            columns={columns}
            isLoading={Store.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default RoomsDashboardApp
