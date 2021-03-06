import React, { memo, useState, lazy, Suspense } from 'react'
import { differenceInDays } from 'date-fns'
import { observer } from 'mobx-react'
import BatchPhases from './batches/BatchPhases'
import DashboardBatchStore from './batches/DashboardBatchStore'
import BatchStore from '../batches/BatchStore'
import StrainDistribution from '../../manager_dashboard/StrainDistribution'
import {
  decimalFormatter,
  numberFormatter,
  formatDate2,
  ActiveBadge,
  CheckboxSelect,
  HeaderFilter,
  ListingTable,
  TempBatchWidgets,
  toast,
  Loading
} from '../../utils'
import PlantByPhaseWidget from '../../inventory/plant_setup/plant_charts/PlantByPhaseWidget'

const Batcheslist = ({
  title,
  count,
  className = '',
  loaded = false,
  dataclassName = 'f2',
  headerClassName = ''
}) => {
  return (
    <div
      className="flex items-center ba b--light-gray pa3 bg-white br2 mr1 mb1 "
      style={{ height: 210 + 'px', width: '50%' }}
    >
      {loaded ? (
        <div
          className={`flex ${headerClassName}`}
          style={{ flex: ' 1 1 auto' }}
        >
          <i
            className={`material-icons white bg-orange md-48 ${className}`}
            style={{ borderRadius: '50%' }}
          >
            access_time
          </i>
          <div className="tc">
            <h1 className="f5 fw6 grey">{title}</h1>
            <b className={`${dataclassName} fw6 dark-grey`}>{count}</b>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

@observer
class BatchesDashboardApp extends React.Component {
  constructor(props) {
    super(props)
    DashboardBatchStore.loadBatches_info(this.props.currentFacilityIds)
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
        minWidth: 160,
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
      },
      {
        headerClassName: 'tr pr3',
        Header: '',
        accessor: 'id',
        className: 'justify-end pr3',
        width: 110,
        Cell: props => {
          if (props.row.status == 'DRAFT') {
            return (
              <a
                className={`pa2 flex link dim pointer items-center red`}
                onClick={() => {
                  this.onDelete(props.original.id)
                }}
              >
                <i className="material-icons md-17 pr2">delete</i>
              </a>
            )
          }
        }
      }
    ]
  }
  componentDidMount() {
    BatchStore.loadBatches(this.props.currentFacilityIds)
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

  onDelete = batchId => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      BatchStore.deleteBatch(batchId)
      //console.log(batchId)
      toast('The Draft Batch has been successfully deleted', 'success')
    }
  }

  render() {
    const { currentFacilityIds, batchesPermission } = this.props
    const { columns } = this.state
    return (
      <div className="pa4">
        <div id="toast" className="toast" />
        {Array.isArray(this.props.currentFacilityIds)
          ? ''
          : batchesPermission.create && (
              <React.Fragment>
                <div className="flex flex-row-reverse">
                  <a
                    href={`/cultivation/batches/new?facility_id=${currentFacilityIds}`}
                    className="btn btn--primary"
                  >
                    Create new batch
                  </a>
                </div>
              </React.Fragment>
            )}
        <div className="flex h-50 pv4">
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: 423 + 'px' }}
            >
              <BatchPhases facility_id={this.props.currentFacilityIds} />
            </div>
          </div>
          <div className="w-50">
            <div className="flex justify-between">
              <Batcheslist
                title="Active Batches"
                count={numberFormatter.format(
                  DashboardBatchStore.data_batches_info.active_batches
                )}
                className="mt4 mb5 ma3"
                loaded={DashboardBatchStore.batches_info_loaded}
              />
              <Batcheslist
                title="Batches In Draft"
                count={numberFormatter.format(
                  DashboardBatchStore.data_batches_info.draft_batches
                )}
                className="mt4 mb5 ma3"
                loaded={DashboardBatchStore.batches_info_loaded}
              />
            </div>

            <div className="flex justify-between">
              <Batcheslist
                title="Scheduled Batches"
                count={numberFormatter.format(
                  DashboardBatchStore.data_batches_info.scheduled_batches
                )}
                className="mt4 mb5 ma3"
                loaded={DashboardBatchStore.batches_info_loaded}
              />
              <Batcheslist
                title="Cost of Active Batches to Date"
                count={`$ ${decimalFormatter.format(
                  DashboardBatchStore.data_batches_info.active_batches_cost
                )}`}
                className="mt4 mb5 ma3"
                loaded={DashboardBatchStore.batches_info_loaded}
                dataclassName="f3"
                headerClassName=""
              />
            </div>
          </div>
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              id="strain_chart"
              style={{ height: 420 + 'px' }}
            >
              <h1 className="f5 fw6 dark-grey">Strain Distribution</h1>
              <StrainDistribution
                url={`/api/v1/dashboard_charts/strain_distribution?facility_id=${
                  this.props.currentFacilityIds
                }`}
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
