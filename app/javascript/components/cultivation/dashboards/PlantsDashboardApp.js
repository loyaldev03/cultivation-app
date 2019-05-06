import 'babel-polyfill'
import React, { memo, useState, lazy, Suspense } from 'react'
import { differenceInDays } from 'date-fns'
import { observer } from 'mobx-react'
import {
  decimalFormatter,
  formatDate2,
  ActiveBadge,
  CheckboxSelect,
  Loading,
  TempPlantWidgets
} from '../../utils'
import ListingTable from './ListingTable'
import store from '../batches/BatchStore'

@observer
class PlantsDashboardApp extends React.Component {
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
        Header: 'Status',
        accessor: 'status',
        className: 'justify-center',
        minWidth: 88,
        Cell: props => <ActiveBadge status={props.value} />
      },
      {
        headerClassName: 'tl',
        Header: 'Strain',
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
        Header: 'Growth Phase',
        accessor: 'current_growth_stage',
        className: 'justify-center ttc',
        minWidth: 74
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
        Header: 'Location',
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
              new Date(),
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
    store.loadBatches()
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
        <div className="flex flex-row-reverse">
          <a
            href={`/cultivation/batches/new?facility_id=${defaultFacilityId}`}
            className="btn btn--primary"
          >
            Destroy Plants
          </a>
        </div>
        <div className="pv4">
          <img src={TempPlantWidgets} />
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
          <ListingTable
            data={store.filteredList}
            columns={columns}
            isLoading={store.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default PlantsDashboardApp
