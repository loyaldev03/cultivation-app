import 'babel-polyfill'
import React, { memo, useState, lazy, Suspense } from 'react'
import ReactTable from 'react-table'
import { observer } from 'mobx-react'
import {
  ActiveBadge,
  CheckboxSelect,
  Loading,
  formatDate2,
  TempBatchWidgets,
} from '../../utils'
import store from '../batches/BatchStore'

class BatchListTable extends React.PureComponent {
  render() {
    const { data, columns, isLoading } = this.props
    return (
      <ReactTable
        className="-highlight dashboard-theme"
        columns={columns}
        data={data}
        loading={isLoading}
        pageSize={20}
        minRows={3}
        showPagination={data && data.length > 20}
      />
    )
  }
}

@observer
class Batches extends React.Component {
  state = {
    columns: [
      { accessor: 'id', show: false },
      { accessor: 'batch_no', show: false },
      {
        headerClassName: 'tl',
        Header: 'Batch ID',
        accessor: 'name',
        className: 'dark-grey pl3 fw6',
        minWidth: 130,
        Cell: props => (
          <a
            className="link dark-grey"
            href={`/cultivation/batches/${props.row.id}`}
            title={props.row.batch_no}
          >
            {props.value}
          </a>
        )
      },
      {
        headerClassName: 'tl',
        Header: 'Status',
        accessor: 'status',
        className: 'justify-center',
        width: 88,
        Cell: props => <ActiveBadge status={props.value} />
      },
      {
        headerClassName: 'tl',
        Header: 'Strain',
        accessor: 'strain_name',
        minWidth: 120
      },
      {
        headerClassName: 'tl',
        Header: 'Total # of plants',
        accessor: 'quantity',
        className: 'justify-end pr3',
        width: 80,
        Cell: props => (props.value ? props.value : '--')
      },
      {
        headerClassName: 'tl',
        Header: 'Growth Phase',
        accessor: 'current_growth_stage',
        className: 'justify-center ttc',
        width: 75
      },
      {
        headerClassName: 'tl',
        Header: 'Destroyed plants',
        accessor: 'destroyed_plants_count',
        className: 'justify-center',
        width: 90,
        Cell: props => (props.value ? props.value : '--')
      },
      {
        headerClassName: 'tl',
        Header: 'Location',
        accessor: 'batch_no',
        minWidth: 110
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
        Header: 'Phase Date',
        accessor: 'start_date2',
        className: 'justify-end pr3',
        width: 88,
        Cell: props => formatDate2(props.value)
      },
      {
        headerClassName: 'tl',
        Header: 'Est. Harvest Date',
        accessor: 'estimated_harvest_date',
        className: 'justify-end pr3',
        width: 98,
        Cell: props => formatDate2(props.value)
      },
      {
        headerClassName: 'tl',
        Header: '# of days in current stage',
        accessor: 'batch_no_2',
        className: 'justify-end pr3',
        width: 100
      }
    ]
  }
  componentDidMount() {
    store.loadBatches()
  }

  onToggleColumns = e => {
    console.log('onToggleColumns:', e.target.name, e.target.checked)
    const opt = this.state.columns.find(x => x.accessor === e.target.name)
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
        <div className="flex flex-row-reverse">
          <a
            href={`/cultivation/batches/new?facility_id=${defaultFacilityId}`}
            className="btn btn--primary"
          >
            Create new batch
          </a>
        </div>
        <div className="pv4">
          <img src={TempBatchWidgets} alt="Scan barcode" />
        </div>
        <div className="flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search Batch ID"
            onChange={e => {
              store.filter = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        <div className="pv3">
          <BatchListTable
            data={store.filteredList}
            columns={columns}
            isLoading={store.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default Batches
