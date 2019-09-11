import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import store from './store/CultivationBatchStore'
import loadCultivationBatch from './actions/loadCultivationBatch'
import BatchEditor from './components/BatchEditor'

import {
  ListingTable,
  HeaderFilter,
  formatDate2,
  CheckboxSelect
} from '../../utils'
import { differenceInDays } from 'date-fns'

function openBatch(event, id) {
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

@observer
class SimpleCultivationBatchSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          accessor: 'id',
          show: false
        },
        {
          Header: 'Batch No',
          accessor: 'batch_no',
          headerClassName: 'tl',
          width: 70,
          Cell: record => (
            <a
              href="#0"
              className="link grey"
              onClick={event => {
                const data = toJS(record.row)
                openBatch(event, record.row.id)
              }}
            >
              {record.value}
            </a>
          )
        },
        {
          Header: 'Batch name',
          accessor: 'name',
          headerClassName: 'tl',
          Cell: record => (
            <a
              href="#0"
              className="link grey"
              onClick={event => {
                const data = toJS(record.original)
                openBatch(event, data)
              }}
            >
              {record.value}
            </a>
          )
        },

        {
          Header: 'Phase',
          accessor: 'current_growth_stage',
          headerClassName: 'tc',
          className: 'tc',
          width: 80
        },
        {
          Header: 'Plant Count',
          accessor: 'plant_count',
          headerClassName: 'tc',
          className: 'tc',
          width: 100
        },
        {
          Header: 'Batch Source',
          accessor: 'batch_source',
          headerClassName: 'tl',
          Cell: props => {
            if (props.value) {
              return (
                <span>
                  {props.value.charAt(0).toUpperCase() + props.value.substr(1)}
                </span>
              )
            }
            return null
          }
        },
        {
          Header: 'Destroyed Plants',
          accessor: 'destroyed_plants_count',
          headerClassName: 'tl',
          Cell: props => (props.value ? props.value : '--')
        },
        {
          headerClassName: 'tl',
          Header: (
            <HeaderFilter
              title="Location"
              accessor="current_stage_location"
              getOptions={store.getUniqPropValues}
              onUpdate={store.updateFilterOptions}
            />
          ),
          accessor: 'current_stage_location',
          minWidth: 180,
          Cell: props => (
            <span className="truncate">{props.value ? props.value : '--'}</span>
          )
        },
        {
          Header: 'Start date',
          accessor: 'start_date',
          headerClassName: 'tl',
          Cell: props => {
            return <span>{props.value ? formatDate2(props.value) : '--'}</span>
          }
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
          Cell: props => (props.value ? formatDate2(props.value) : '--')
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
          Header: 'Facility',
          accessor: 'facility',
          headerClassName: 'tl'
        }
      ]
    }
  }
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadCultivationBatch()
  }

  onAddRecord = () => {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
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

  renderBatchList() {
    const { columns } = this.state
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">
              Cultivation Batches
            </h1>
            <div style={{ justifySelf: 'end' }}>
              {this.props.plantPermission.create && (
                <button
                  className="btn btn--primary btn--small"
                  onClick={this.onAddRecord}
                >
                  Add batch
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <input
              type="text"
              className="input w5"
              placeholder="Search Plants"
              onChange={e => {
                store.filter = e.target.value
              }}
            />
            <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
          </div>

          <div className="pv3">
            <ListingTable
              columns={columns}
              data={store.filteredList}
              className="f6 -highlight"
              isLoading={store.isLoading}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderBatchList()}
        <BatchEditor
          facility_strains={this.props.facility_strains}
          batch_sources={this.props.batch_sources}
          grow_methods={this.props.grow_methods}
          canUpdate={this.props.plantPermission.update}
          canCreate={this.props.plantPermission.create}
        />
      </React.Fragment>
    )
  }
}

export default SimpleCultivationBatchSetupApp
