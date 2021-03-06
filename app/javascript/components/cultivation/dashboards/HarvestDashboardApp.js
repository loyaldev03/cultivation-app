import React from 'react'
import { observer } from 'mobx-react'
import {
  ActiveBadge,
  CheckboxSelect,
  TempHarvestWidgets,
  HeaderFilter,
  ListingTable
} from '../../utils'
import classNames from 'classnames'
import HarvestAverageWidget from '../dashboards/harvests/HarvestAverageWidget'
import HarvestByYeildWidget from '../dashboards/harvests/HarvestByYeildWidget'
import HarvestCostByGramWidget from '../dashboards/harvests/HarvestCostByGramWidget'

import HarvestBatchStore from '../../dailyTask/stores/HarvestBatchStore'
@observer
class HarvestDashboard extends React.Component {
  state = {
    columns: [
      { accessor: 'id', show: false },
      { accessor: 'cultivation_batch_id', show: false },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Harvest Name"
            accessor="harvest_name"
            getOptions={HarvestBatchStore.getUniqPropValues}
            onUpdate={HarvestBatchStore.updateFilterOptions}
          />
        ),
        accessor: 'harvest_name',
        minWidth: 120,
        className: 'ttu',
        Cell: props => <span className="truncate black fw6">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Strain"
            accessor="strain_name"
            getOptions={HarvestBatchStore.getUniqPropValues}
            onUpdate={HarvestBatchStore.updateFilterOptions}
          />
        ),
        accessor: 'strain_name',
        minWidth: 88,
        className: 'ttu',
        Cell: props => <span>{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Total # of Plants',
        accessor: 'plants_count',
        minWidth: 88,
        Cell: props => <span>{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Wet Weight',
        accessor: 'total_wet_weight',
        minWidth: 88,
        Cell: props => <span>{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Dry Weight',
        accessor: 'total_dry_weight',
        minWidth: 88,
        Cell: props => <span>{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Waste Weight',
        accessor: 'waste_weight',
        minWidth: 88,
        Cell: props => <span>{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Avg Dry Waste',
        accessor: 'a',
        minWidth: 88,
        Cell: props => <span>{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Total Pkg Weight',
        accessor: 'package_count',
        minWidth: 88,
        Cell: props => <span>{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Lab Testing',
        accessor: 'a',
        minWidth: 88,
        Cell: props => <span>{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Cost / gram',
        accessor: 'a',
        minWidth: 88,
        Cell: props => <span>{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Yield / sq. ft',
        accessor: 'a',
        minWidth: 88,
        Cell: props => <span>{props.value}</span>
      }
    ]
  }
  componentDidMount() {
    HarvestBatchStore.loadAll()
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
    const { currentFacilityIds } = this.props
    const { columns } = this.state
    return (
      <div className="pa4">
        <div className="flex flex-row-reverse">
          {/* <span className="f5 fw6">
            You have
            <span className="orange"> Something here</span>
          </span> */}
        </div>
        <div className="pv4">
          <div className="flex h-50">
            <div className="w-30">
              <HarvestAverageWidget facility_id={currentFacilityIds} />
            </div>
            <div className="w-50">
              <div
                className="ba b--light-gray pa3 bg-white br2 mr3"
                style={{ height: 320 + 'px' }}
              >
                <HarvestByYeildWidget facility_id={currentFacilityIds} />
              </div>
            </div>
            <div className="w-50">
              <div
                className="ba b--light-gray pa3 bg-white br2"
                style={{ height: 320 + 'px' }}
              >
                <HarvestCostByGramWidget facility_id={currentFacilityIds} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search Plants"
            onChange={e => {
              HarvestBatchStore.filter = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        <div className="pv3">
          <ListingTable
            data={HarvestBatchStore.filteredList}
            columns={columns}
            isLoading={HarvestBatchStore.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default HarvestDashboard
