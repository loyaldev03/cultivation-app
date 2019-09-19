import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import {
  CheckboxSelect,
  ListingTable,
  HeaderFilter,
  ActiveBadge,
  TempPackagesHistory
} from '../../utils'
import classNames from 'classnames'
import uniq from 'lodash.uniq'
import PlantWasteStore from './PlantWasteStore'

const dummyData = [
  {
    waste_type: 'Destroyed Plant',
    cultivation_batch: 'ABCDE',
    harvest_id: 'acme',
    plant_id: 'Plant0001',
    strain_name: 'Afgani',
    current_grow_phase: 'Flower',
    location_name: 'Flower Room 2',
    location_type: 'Waste Room',
    planting_date: '1/1/2019',
    harvest_date: '1/1/2019',
    destroyed_date: '1/1/2019',
    destroyed_reason: '1/1/2019',
    net_waste_weight: '20lbs',
    assigned_to: 'Christie Ma'
  },
  {
    waste_type: 'Destroyed Plant',
    cultivation_batch: 'ABCDE',
    harvest_id: 'acme',
    plant_id: 'Plant0001',
    strain_name: 'Afgani',
    current_grow_phase: 'Flower',
    location_name: 'Flower Room 2',
    location_type: 'Waste Room',
    planting_date: '1/1/2019',
    harvest_date: '1/1/2019',
    destroyed_date: '1/1/2019',
    destroyed_reason: '1/1/2019',
    net_waste_weight: '20lbs',
    assigned_to: 'Christie Ma'
  },
  {
    waste_type: 'Destroyed Plant',
    cultivation_batch: 'ABCDE',
    harvest_id: 'acme',
    plant_id: 'Plant0001',
    strain_name: 'Afgani',
    current_grow_phase: 'Flower',
    location_name: 'Flower Room 2',
    location_type: 'Waste Room',
    planting_date: '1/1/2019',
    harvest_date: '1/1/2019',
    destroyed_date: '1/1/2019',
    destroyed_reason: '1/1/2019',
    net_waste_weight: '20lbs',
    assigned_to: 'Christie Ma'
  },
  {
    waste_type: 'Destroyed Plant',
    cultivation_batch: 'ABCDE',
    harvest_id: 'acme',
    plant_id: 'Plant0001',
    strain_name: 'Afgani',
    current_grow_phase: 'Flower',
    location_name: 'Flower Room 2',
    location_type: 'Waste Room',
    planting_date: '1/1/2019',
    harvest_date: '1/1/2019',
    destroyed_date: '1/1/2019',
    destroyed_reason: '1/1/2019',
    net_waste_weight: '20lbs',
    assigned_to: 'Christie Ma'
  },
  {
    waste_type: 'Destroyed Plant',
    cultivation_batch: 'ABCDE',
    harvest_id: 'acme',
    plant_id: 'Plant0001',
    strain_name: 'Afgani',
    current_grow_phase: 'Flower',
    location_name: 'Flower Room 2',
    location_type: 'Waste Room',
    planting_date: '1/1/2019',
    harvest_date: '1/1/2019',
    destroyed_date: '1/1/2019',
    destroyed_reason: '1/1/2019',
    net_waste_weight: '20lbs',
    assigned_to: 'Christie Ma'
  },
  {
    waste_type: 'Destroyed Plant',
    cultivation_batch: 'ABCDE',
    harvest_id: 'acme',
    plant_id: 'Plant0001',
    strain_name: 'Afgani',
    current_grow_phase: 'Flower',
    location_name: 'Flower Room 2',
    location_type: 'Waste Room',
    planting_date: '1/1/2019',
    harvest_date: '1/1/2019',
    destroyed_date: '1/1/2019',
    destroyed_reason: '1/1/2019',
    net_waste_weight: '20lbs',
    assigned_to: 'Christie Ma'
  },
  {
    waste_type: 'Destroyed Plant',
    cultivation_batch: 'ABCDE',
    harvest_id: 'acme',
    plant_id: 'Plant0001',
    strain_name: 'Afgani',
    current_grow_phase: 'Flower',
    location_name: 'Flower Room 2',
    location_type: 'Waste Room',
    planting_date: '1/1/2019',
    harvest_date: '1/1/2019',
    destroyed_date: '1/1/2019',
    destroyed_reason: '1/1/2019',
    net_waste_weight: '20lbs',
    assigned_to: 'Christie Ma'
  },
  {
    waste_type: 'Destroyed Plant',
    cultivation_batch: 'ABCDE',
    harvest_id: 'acme',
    plant_id: 'Plant0001',
    strain_name: 'Afgani',
    current_grow_phase: 'Flower',
    location_name: 'Flower Room 2',
    location_type: 'Waste Room',
    planting_date: '1/1/2019',
    harvest_date: '1/1/2019',
    destroyed_date: '1/1/2019',
    destroyed_reason: '1/1/2019',
    net_waste_weight: '20lbs',
    assigned_to: 'Christie Ma'
  }
]

class OrderStore {
  updateFilterOptions = (propName, filterOptions) => {
    const updated = {
      ...this.columnFilters,
      [propName]: filterOptions
    }
    this.columnFilters = updated
  }

  getUniqPropValues = propName => {
    return uniq(dummyData.map(x => x[propName]).sort())
  }
}

const orderStore = new OrderStore()

@observer
class WastesDashboardApp extends React.Component {
  state = {
    columns: [
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
        className: 'justify-center'
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Batch ID"
            accessor="cultivation_batch"
            getOptions={PlantWasteStore.getUniqPropValues}
            onUpdate={PlantWasteStore.updateFilterOptions}
          />
        ),
        accessor: 'cultivation_batch',
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
        className: ' pr3 justify-center'
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
        Header: 'Grow Phase',
        accessor: 'current_growth_stage',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Location Origin',
        accessor: 'location_name',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Location',
        accessor: 'location_type',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Planting Date',
        accessor: 'planting_date',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Harvest Date',
        accessor: 'harvest_date',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Destroyed Date',
        accessor: 'destroyed_date',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Reason"
            accessor="destroyed_reason"
            getOptions={orderStore.getUniqPropValues}
            onUpdate={orderStore.updateFilterOptions}
          />
        ),
        accessor: 'customer',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Weight',
        accessor: 'net_waste_weight',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Assigned To',
        accessor: 'assigned_to',
        className: ' pr3 justify-center'
      }
    ]
  }

  constructor(props) {
    super(props)
    PlantWasteStore.loadPlants(this.props.currentFacilityId)
  }

  componentDidMount() {
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
    // const { defaultFacilityId } = this.props
    const { columns } = this.state
    return (
      <div className="pa4">
        <div className="flex flex-row-reverse" />
        <div className="flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search"
            // onChange={e => {
            //   BatchStore.filter = e.target.value
            // }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        <div className="pv3">
          <ListingTable
            data={PlantWasteStore.filteredList}
            columns={columns}
            isLoading={PlantWasteStore.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default WastesDashboardApp
