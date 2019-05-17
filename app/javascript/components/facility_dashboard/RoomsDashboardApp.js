import 'babel-polyfill'
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
      {
        headerClassName: 'pl3 tl',
        Header: 'Room Name',
        accessor: 'room_name',
        className: 'dark-grey pl3 fw6',
        minWidth: 128,
        Cell: props => (
          <a
            className="link dark-grey truncate"
            href={`/cultivation/batches/${props.row.id}`}
            title={props.row.batch_no}
          >
            {props.value}
          </a>
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
        width: 120
      },
      {
        headerClassName: 'tl',
        Header: 'Total Used',
        accessor: 'planned_capacity',
        className: 'justify-end pr3',
        width: 100
      },
      {
        headerClassName: 'tl',
        Header: 'Total Available',
        accessor: 'available_capacity',
        className: 'justify-end pr3',
        width: 120
      },
      {
        headerClassName: 'tl',
        Header: '# of Sections',
        accessor: 'stage_days',
        className: 'justify-end pr3',
        width: 98
      },
      {
        headerClassName: 'tr pr3',
        Header: '# of Rows',
        accessor: 'estimated_hours',
        className: 'justify-end pr3',
        width: 96
      },
      {
        headerClassName: 'tr pr3',
        Header: '# of Shelves',
        accessor: 'actual_hours',
        className: 'justify-end pr3',
        width: 100
      },
      {
        headerClassName: 'tr pr3',
        Header: '# of Trays',
        accessor: 'estimated_cost',
        className: 'justify-end pr3',
        width: 96
      }
    ]
  }

  componentDidMount() {
    Store.loadRooms(this.props.defaultFacilityId)
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
        <div className="flex flex-row-reverse">
          <a
            href={`/cultivation/batches/new?facility_id=${defaultFacilityId}`}
            className="btn btn--primary"
          >
            Create new room
          </a>
        </div>
        <div className="mt4 flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search Room"
            onChange={e => {
              Store.filter = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
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
