import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import {
  CheckboxSelect,
  ListingTable,
  HeaderFilter,
  ActiveBadge,
  TempPackagesHistory,
  formatDate2
} from '../../utils'
import classNames from 'classnames'
import uniq from 'lodash.uniq'
import loadDestroyedPlants from '../../inventory/plant_setup/actions/loadDestroyedPlants'
import plantStore from '../../inventory/plant_setup/store/PlantStore'

@observer
class DestroyedPlantDashboardApp extends React.Component {
  state = {
    columns: [
      {accessor: 'plant_id', show: false},
      {
        headerClassName: 'pl3 tl',
        Header: 'Plant ID',
        accessor: 'plant_tag',
        className: 'dark-grey pl3 fw6',
        minWidth: 150,
        Cell: props => 
          (<span>{props.value || props.row.plant_id }</span>)
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Batch ID"
            accessor="cultivation_batch"
            getOptions={plantStore.getUniqPropValues}
            onUpdate={plantStore.updateFilterOptions}
          />
        ),
        accessor: 'cultivation_batch',
        className: 'justify-center',
        minWidth: 120
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Strain"
            accessor="strain_name"
            getOptions={plantStore.getUniqPropValues}
            onUpdate={plantStore.updateFilterOptions}
          />
        ),
        accessor: 'strain_name',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Grow Phase',
        accessor: 'current_grow_stage',
        className: ' pr3 justify-center',
        width: 120
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Location Origin"
            accessor="location_name"
            getOptions={plantStore.getUniqPropValues}
            onUpdate={plantStore.updateFilterOptions}
          />
        ),
        accessor: 'location_name',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Location"
            accessor="location_type"
            getOptions={plantStore.getUniqPropValues}
            onUpdate={plantStore.updateFilterOptions}
          />
        ),
        accessor: 'location_type',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Planted Date',
        accessor: 'planting_date',
        className: ' pr3 justify-center',
        width: 120,
        Cell: props => (
          <span>{props.value ? formatDate2(props.value) : '--'}</span>
        )
      },
      {
        headerClassName: '',
        Header: 'Batch Start Date',
        accessor: 'batch_start_date',
        className: ' pr3 justify-center',
        width: 120,
        Cell: props => (
          <span>{props.value ? formatDate2(props.value) : '--'}</span>
        )
      },
      {
        headerClassName: '',
        Header: 'Destroyed Date',
        accessor: 'destroyed_date',
        className: ' pr3 justify-center',
        width: 110,
        Cell: props => (
          <span>{props.value ? formatDate2(props.value) : '--'}</span>
        )
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Reason"
            accessor="destroyed_reason"
            getOptions={plantStore.getUniqPropValues}
            onUpdate={plantStore.updateFilterOptions}
          />
        ),
        accessor: 'destroyed_reason',
        className: ' pr3 justify-left',
        width: 110
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Assigned To"
            toLeft={true}
            accessor="worker_name"
            getOptions={plantStore.getUniqPropValues}
            onUpdate={plantStore.updateFilterOptions}
          />
        ),
        accessor: 'worker_name',
        className: ' pr3 justify-center',
        width: 110
      },
    ]
  }
  componentDidMount() {
    loadDestroyedPlants(this.props.facility_id)
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
        <div className="flex flex-column justify-between pa4">
        <div className="flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search Plant"
            onChange={e => {
              plantStore.filter = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        <div className="pv3">
          <ListingTable
            data={plantStore.filteredList}
            columns={columns}
            isLoading={plantStore.isLoading}
          />
        </div>

        </div>
       
      </div>
    )
  }
}

export default DestroyedPlantDashboardApp
