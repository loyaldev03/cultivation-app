import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import {
  CheckboxSelect,
  ListingTable,
  HeaderFilter,
  formatDate2,
  ActiveBadge,
  TempPackagesHistory
} from '../../utils'
import classNames from 'classnames'
import uniq from 'lodash.uniq'
import PlantWasteStore from './PlantWasteStore'


@observer
class WastesDashboardApp extends React.Component {
  state = {
    columns: [
      { accessor: 'wet_weight_uom', show: false },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Waste Type"
            accessor="waste_type"
            getOptions={PlantWasteStore.getUniqPropValues}
            onUpdate={PlantWasteStore.updateFilterOptions}
          />
        ),
        accessor: 'waste_type',
        className: 'justify-center',
        Cell: props => <span className="truncate">Destroyed Plant</span>
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Batch ID"
            accessor="batch_id"
            getOptions={PlantWasteStore.getUniqPropValues}
            onUpdate={PlantWasteStore.updateFilterOptions}
          />
        ),
        accessor: 'batch_id',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Harvest ID"
            accessor="harvest_id"
            getOptions={PlantWasteStore.getUniqPropValues}
            onUpdate={PlantWasteStore.updateFilterOptions}
          />
        ),
        accessor: 'harvest_id',
        className: ' pr3 justify-center',
        Cell: props => <span className="truncate">{props.value || "--"}</span>
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Plant ID"
            accessor="plant_id"
            getOptions={PlantWasteStore.getUniqPropValues}
            onUpdate={PlantWasteStore.updateFilterOptions}
          />
        ),
        accessor: 'plant_id',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Strain"
            accessor="strain_name"
            getOptions={PlantWasteStore.getUniqPropValues}
            onUpdate={PlantWasteStore.updateFilterOptions}
          />
        ),
        accessor: 'strain_name',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Grow Phase"
            accessor="current_growth_stage"
            getOptions={PlantWasteStore.getUniqPropValues}
            onUpdate={PlantWasteStore.updateFilterOptions}
          />
        ),
        accessor: 'current_growth_stage',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Location Origin"
            accessor="location"
            getOptions={PlantWasteStore.getUniqPropValues}
            onUpdate={PlantWasteStore.updateFilterOptions}
          />
        ),
        accessor: 'location',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Planting Date"
            accessor="planting_date"
            getOptions={PlantWasteStore.getUniqPropValues}
            onUpdate={PlantWasteStore.updateFilterOptions}
          />
        ),
        accessor: 'planting_date',
        className: ' pr3 justify-center',
        Cell: props => <span className="truncate">{props.value ? formatDate2(props.value) : '--'}</span>
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Harvest Date"
            accessor="harvest_date"
            getOptions={PlantWasteStore.getUniqPropValues}
            onUpdate={PlantWasteStore.updateFilterOptions}
          />
        ),
        accessor: 'harvest_date',
        className: ' pr3 justify-center',
        Cell: props => <span className="truncate">{props.value ? formatDate2(props.value) : '--'}</span>
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Destroyed Date"
            accessor="destroyed_date"
            getOptions={PlantWasteStore.getUniqPropValues}
            onUpdate={PlantWasteStore.updateFilterOptions}
          />
        ),
        accessor: 'destroyed_date',
        className: ' pr3 justify-center',
        Cell: props => <span className="truncate">{props.value ? formatDate2(props.value) : '--'}</span>
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Reason"
            accessor="destroyed_reason"
            getOptions={PlantWasteStore.getUniqPropValues}
            onUpdate={PlantWasteStore.updateFilterOptions}
          />
        ),
        accessor: 'destroyed_reason',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Weight',
        accessor: 'wet_waste_weight',
        className: ' pr3 justify-center',
        Cell: props => (
          <span className="truncate">
            {props.value} {props.row.wet_weight_uom}
          </span>
        )
      },
      {
        headerClassName: '',
        Header: 'Assigned To',
        Header: (
          <HeaderFilter
            toLeft={true}
            title="Assigned To"
            accessor="assigned_to"
            getOptions={PlantWasteStore.getUniqPropValues}
            onUpdate={PlantWasteStore.updateFilterOptions}
          />
        ),
        accessor: 'assigned_to',
        className: ' pr3 justify-center',
        Cell: props => (
          <span className="truncate">
            {props.value || "--"} 
          </span>
        )
      }
    ]
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

  onFetchData = (state, instance) => {
    PlantWasteStore.setFilter({
      facility_id: this.props.facility_id,
      page: state.page,
      limit: state.pageSize
    })
  }

  render() {
    const { columns } = this.state
    return (
      <div className="pa4">
        <div className="flex flex-row-reverse" />
        <div className="flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search"
            onChange={e => {
              PlantWasteStore.searchTerm = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        <div className="pv3">
          <ListingTable
            ajax={true}
            data={PlantWasteStore.filteredList}
            onFetchData={this.onFetchData}
            pages={PlantWasteStore.metadata.pages}
            columns={columns}
            isLoading={PlantWasteStore.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default WastesDashboardApp
