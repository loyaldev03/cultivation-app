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
import loadPlants from '../../inventory/plant_setup/actions/loadPlants'
import PlantStore from '../../inventory/plant_setup/store/PlantStore'

@observer
class PlantsDashboardApp extends React.Component {
  state = {
    columns: [
      { accessor: 'id', show: false },
      { accessor: 'plant_id', show: false },
      {
        headerClassName: 'pl3 tl',
        Header: 'Plant ID',
        accessor: 'plant_tag',
        className: 'dark-grey pl3 fw6',
        minWidth: 138,
        Cell: props => (
          <a
            className="link dark-grey truncate"
            href={`/cultivation/batches/${props.row.id}`}
            title={props.row.plant_id}
          >
            {props.row.plant_id || props.value}
          </a>
        )
      },
      {
        headerClassName: 'tl',
        Header: 'Batch ID',
        accessor: 'cultivation_batch_name',
        width: 138,
        Cell: props => (props.value ? props.value : '--')
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
        Header: 'Growth Phase',
        accessor: 'batch_growth_stage',
        className: 'justify-center ttc',
        minWidth: 74
      },
      {
        headerClassName: 'tl',
        Header: 'Location',
        accessor: 'location_name',
        minWidth: 180,
        Cell: props => <span className="truncate">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Planted Date',
        accessor: 'planting_date',
        className: 'justify-end pr3',
        width: 88,
        Cell: props => formatDate2(props.value)
      },
      {
        headerClassName: 'tl',
        Header: 'Batch Start Date',
        accessor: 'batch_start_date',
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
      }
    ]
  }
  componentDidMount() {
    loadPlants('', '', this.props.defaultFacilityId, ['mother'])
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
          <img src={TempPlantWidgets} className="w-100" />
        </div>
        <div className="flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search Batch ID"
            onChange={e => {
              PlantStore.filter = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        <div className="pv3">
          <ListingTable
            data={PlantStore.filteredList}
            columns={columns}
            isLoading={PlantStore.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default PlantsDashboardApp
