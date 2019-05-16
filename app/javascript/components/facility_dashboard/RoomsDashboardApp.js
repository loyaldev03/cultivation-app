import 'babel-polyfill'
import React, { memo, useState, lazy, Suspense } from 'react'
import { differenceInDays } from 'date-fns'
import { observer } from 'mobx-react'
import {
  decimalFormatter,
  formatDate2,
  ActiveBadge,
  CheckboxSelect,
  HeaderFilter,
  Loading,
  ListingTable,
  TempBatchWidgets
} from '../utils'

@observer
class RoomsDashboardApp extends React.Component {
  state = {
    columns: [
      { accessor: 'id', show: false },
      {
        headerClassName: 'pl3 tl',
        Header: 'Room Name',
        accessor: 'name',
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
        accessor: 'code',
        className: 'justify-end pr3',
        minWidth: 100
      },
      {
        headerClassName: 'tl',
        Header: 'Purpose',
        accessor: 'purpose',
        className: 'justify-center',
        minWidth: 100
      },
      {
        headerClassName: 'tl',
        Header: 'Plant Capacity',
        accessor: 'capacity',
        className: 'justify-end pr3',
        width: 120
      },
      {
        headerClassName: 'tl',
        Header: 'Total Used',
        accessor: 'total_occupied',
        className: 'justify-end pr3',
        width: 100
      },
      {
        headerClassName: 'tl',
        Header: 'Total Available',
        accessor: 'total_available',
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
  componentDidMount() {}

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
            placeholder="Search Batch ID"
            onChange={e => {
              // BatchStore.filter = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        <div className="pv3">
          <ListingTable
            data={[] /*BatchStore.filteredList*/}
            columns={columns}
            isLoading={false /*BatchStore.isLoading*/}
          />
        </div>
      </div>
    )
  }
}

export default RoomsDashboardApp
