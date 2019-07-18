import React, { memo, useState, lazy, Suspense } from 'react'
import { differenceInDays } from 'date-fns'
import { observer } from 'mobx-react'
import BatchPhases from './batches/BatchPhases'
import DahboardBatchStore from './batches/DahboardBatchStore'
import { formatYDM } from '../../utils/DateHelper'
import BatchStore from '../batches/BatchStore'
import {
  decimalFormatter,
  formatDate2,
  ActiveBadge,
  CheckboxSelect,
  HeaderFilter,
  Loading,
  ListingTable,
  TempBatchWidgets
} from '../../utils'

const Batcheslist = ({ title, count, className = '' }) => {
  return (
    <div
      className="flex items-center ba b--light-gray pa3 bg-white br2 mr1 mb1 "
      style={{ height: 210 + 'px', width: '50%' }}
    >
      <div className="flex" style={{ flex: ' 1 1 auto' }}>
        <i
          className={`material-icons white bg-orange md-48 ${className}`}
          style={{ borderRadius: '50%' }}
        >
          access_time
        </i>
        <div className="tc">
          <h1 className="f5 fw6 grey">{title}</h1>
          <b className="f2 fw6">{count}</b>
        </div>
      </div>
    </div>
  )
}

@observer
class BatchesDashboardApp extends React.Component {
  constructor(props) {
    super(props)
    DahboardBatchStore.loadBatchDistribution(formatYDM(new Date()), 'All')
  }
  state = {
    columns: [
      { accessor: 'id', show: false },
      { accessor: 'batch_no', show: false },
      {
        headerClassName: 'pl3 tl',
        Header: 'Batch ID',
        accessor: 'name',
        className: 'dark-grey pl3 fw6',
        minWidth: 138,
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
        Header: (
          <HeaderFilter
            title="Status"
            accessor="status"
            getOptions={BatchStore.getUniqPropValues}
            onUpdate={BatchStore.updateFilterOptions}
          />
        ),
        accessor: 'status',
        className: 'justify-center',
        minWidth: 100,
        Cell: props => <ActiveBadge status={props.value} />
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Strain"
            accessor="strain_name"
            getOptions={BatchStore.getUniqPropValues}
            onUpdate={BatchStore.updateFilterOptions}
          />
        ),
        accessor: 'strain_name',
        minWidth: 120,
        Cell: props => <span className="truncate">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Total # of plants',
        accessor: 'quantity',
        className: 'justify-end pr3',
        width: 74,
        Cell: props => (props.value ? props.value : '--')
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Growth Phase"
            accessor="current_growth_stage"
            getOptions={BatchStore.getUniqPropValues}
            onUpdate={BatchStore.updateFilterOptions}
          />
        ),
        accessor: 'current_growth_stage',
        className: 'justify-center ttc',
        minWidth: 130
      },
      {
        headerClassName: 'tl',
        Header: 'Destroyed plants',
        accessor: 'destroyed_plants_count',
        className: 'justify-center',
        width: 84,
        Cell: props => (props.value ? props.value : '--')
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Location"
            accessor="current_stage_location"
            getOptions={BatchStore.getUniqPropValues}
            onUpdate={BatchStore.updateFilterOptions}
          />
        ),
        accessor: 'current_stage_location',
        minWidth: 180,
        Cell: props => <span className="truncate">{props.value}</span>
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
        accessor: 'current_stage_start_date',
        className: 'justify-end pr3',
        width: 88,
        Cell: props => (props.value ? formatDate2(props.value) : '--')
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
        accessor: 'stage_days',
        className: 'justify-end pr3',
        width: 100,
        Cell: props => {
          if (props.row.current_stage_start_date)
            return differenceInDays(
              this.props.currentTime,
              props.row.current_stage_start_date
            )
          else return '--'
        }
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
  componentDidMount() {
    BatchStore.loadBatches(this.props.facilityId)
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
    const { facilityId } = this.props
    const { columns } = this.state
    return (
      <div className="pa4 mw1200">
        <div className="flex flex-row-reverse">
          <a
            href={`/cultivation/batches/new?facility_id=${facilityId}`}
            className="btn btn--primary"
          >
            Create new batch
          </a>
        </div>
        <div className="flex h-50 pv4">
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: 423 + 'px' }}
            >
              <BatchPhases />
            </div>
          </div>
          <div className="w-50">
            <div className="flex justify-between">
              <Batcheslist title="Active Batches" count="156" className="ma3" />
              <Batcheslist
                title="Batches In Draft"
                count="23"
                className="ma3"
              />
            </div>

            <div className="flex justify-between">
              <Batcheslist
                title="Unscheduled Batches"
                count="23"
                className="ma3"
              />
              <Batcheslist
                title="Cost of Active Batches to Date"
                count="$ 2345"
                className="mt4 mb4"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search Batch ID"
            onChange={e => {
              BatchStore.filter = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        <div className="pv3">
          <ListingTable
            data={BatchStore.filteredList}
            columns={columns}
            isLoading={BatchStore.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default BatchesDashboardApp
