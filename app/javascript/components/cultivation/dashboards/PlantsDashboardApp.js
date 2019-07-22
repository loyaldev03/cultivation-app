import React, { memo, useState, lazy, Suspense } from 'react'
import { differenceInDays } from 'date-fns'
import { observer } from 'mobx-react'
import {
  decimalFormatter,
  formatDate2,
  ActiveBadge,
  CheckboxSelect,
  Loading,
  HeaderFilter,
  ListingTable,
  TempPlantWidgets,
  SlidePanel
} from '../../utils'
import loadPlants from '../../inventory/plant_setup/actions/loadPlants'
import PlantStore from '../../inventory/plant_setup/store/PlantStore'
import ReportDestroyedPlants from '../tasks_setup/components/ReportDestroyedPlants'
import PlantWidgetApp from './plants/PlantWidgetApp'

@observer
class PlantsDashboardApp extends React.Component {
  state = {
    showDestroyedPlants: false,
    columns: [
      { accessor: 'id', show: false },
      { accessor: 'plant_id', show: false },
      { accessor: 'cultivation_batch_id', show: false },
      {
        headerClassName: 'pl3 tl',
        Header: 'Plant ID',
        accessor: 'plant_tag',
        className: 'dark-grey pl3 fw6',
        minWidth: 184,
        Cell: props => (
          <a
            className="link grey truncate"
            href={`/cultivation/batches/${props.row.cultivation_batch_id}`}
            title={props.row.plant_id}
          >
            {props.row.plant_id || props.value}
          </a>
        )
      },
      {
        headerClassName: 'pl3 tl',
        Header: 'Batch ID',
        accessor: 'cultivation_batch_name',
        className: 'pl3 fw6',
        minWidth: 144,
        Cell: props => (
          <a
            className="link grey truncate"
            href={`/cultivation/batches/${props.row.cultivation_batch_id}`}
          >
            {props.value || 'Unnamed Batch'}
          </a>
        )
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Strain"
            accessor="strain_name"
            getOptions={PlantStore.getUniqPropValues}
            onUpdate={PlantStore.updateFilterOptions}
          />
        ),
        accessor: 'strain_name',
        minWidth: 130,
        Cell: props => <span className="truncate">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Growth Phase"
            accessor="batch_growth_stage"
            getOptions={PlantStore.getUniqPropValues}
            onUpdate={PlantStore.updateFilterOptions}
          />
        ),
        accessor: 'batch_growth_stage',
        className: 'justify-center ttc',
        minWidth: 128
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Location"
            accessor="location_name"
            getOptions={PlantStore.getUniqPropValues}
            onUpdate={PlantStore.updateFilterOptions}
          />
        ),
        accessor: 'location_name',
        minWidth: 100,
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
              this.props.currentTime,
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
    const { columns, showDestroyedPlants } = this.state
    return (
      <div className="pa4 mw1200">
        <div className="flex flex-row-reverse">
          <a
            href="#0"
            className="btn btn--primary"
            onClick={() =>
              this.setState({
                showDestroyedPlants: true
              })
            }
          >
            Destroy Plants
          </a>
        </div>
        <div className="pv4">
          <img src={TempPlantWidgets} className="w-100" />
          <PlantWidgetApp />
        </div>
        <div className="flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search Plants"
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
        <SlidePanel
          show={showDestroyedPlants}
          renderBody={props => (
            <ReportDestroyedPlants
              batch_id={defaultFacilityId}
              title="Report Destroyed Plants"
              onClose={() => this.setState({ showDestroyedPlants: false })}
            />
          )}
        />
      </div>
    )
  }
}

export default PlantsDashboardApp
