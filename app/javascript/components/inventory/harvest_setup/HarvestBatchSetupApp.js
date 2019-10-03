import React from 'react'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import HarvestBatchEditor from './components/HarvestBatchEditor'

import harvestBatchStore from './store/HarvestBatchStore'
//import loadHarvests from './actions/loadHarvests'
import { ListingTable, HeaderFilter, CheckboxSelect } from '../../utils'

function openSidebar(event, id) {
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

@observer
class HarvestbatchSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          Header: 'Harvest',
          accessor: 'harvest_name',
          headerStyle: { textAlign: 'left' },
          Cell: x => (
            <a
              href="#0"
              className="link grey"
              onClick={event => openSidebar(event, x.original.id)}
            >
              {x.value}
            </a>
          )
        },
        {
          Header: 'Strain',
          accessor: 'strain_name',
          headerStyle: { textAlign: 'left' },
        },
        {
          Header: (
            <HeaderFilter
              title="Cultivation Batch"
              accessor="cultivation_batch_name"
              getOptions={harvestBatchStore.getUniqPropValues}
              onUpdate={harvestBatchStore.updateFilterOptions}
            />
          ),
          accessor: 'cultivation_batch_name',
          headerStyle: { textAlign: 'left' }
        },
        {
          Header: '# of Plants',
          accessor: 'plant_count',
          headerStyle: { textAlign: 'center' },
          width: 88,
          className: 'justify-end',
        },
        {
          Header: 'Locations',
          accessor: 'location_name',
          headerStyle: { textAlign: 'left' },
          Cell: props => (
            <span>{props.value ? props.value : '--'}</span>
          )
        },
        {
          Header: 'Harvest date',
          accessor: 'harvest_date',
          headerStyle: { textAlign: 'left' },
          Cell: props => {
            if (props.value && props.value.length > 0) {
              const d = new Date(props.value)
              return (
                <span>{`${d.getMonth() +
                  1}/${d.getDate()}/${d.getFullYear()}`}</span>
              )
            } else {
              return '--'
            }
          }
        },
        {accessor: 'uom', show: false},
        {
          Header: 'Total weight',
          accessor: 'total_wet_weight',
          width: 88,
          className: 'justify-end',
          Cell: props => (<span>{props.value} {props.row.uom}</span>)
        },
        {
          Header: (
            <HeaderFilter
              title="Status"
              accessor="status"
              getOptions={harvestBatchStore.getUniqPropValues}
              onUpdate={harvestBatchStore.updateFilterOptions}
            />
          ),
          accessor: 'status',
          headerStyle: { textAlign: 'left' },
          className: 'tl',
        }
      ]
    }
  }
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    //loadHarvests(this.props.facility_id)
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

  openSidebar() {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  onFetchData = (state, instance) => {
    harvestBatchStore.setFilter({
      facility_id: this.props.facility_id,
      page: state.page,
      limit: state.pageSize
    })
    //store.loadCultBatches()
  }
  onSave = payload => {
    if (payload) {
      harvestBatchStore.loadHarvestBatches()
    }
  }

  render() {
    const { plantPermission } = this.props
    const { columns } = this.state
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">Harvest Batches</h1>
            <div style={{ justifySelf: 'end' }}>
              {plantPermission.create && (
                <div>
                  <button
                    className="btn btn--primary btn--small"
                    onClick={this.openSidebar}
                  >
                    Add Harvest Batch
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between pb2">
            <input
              type="text"
              className="input w5"
              placeholder="Search Batch Name"
              onChange={e => {
                harvestBatchStore.searchTerm = e.target.value
              }}
            />
            <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
          </div>
          <ListingTable
              ajax={true}
              onFetchData={this.onFetchData}
              data={harvestBatchStore.filteredList}
              pages={harvestBatchStore.metadata.pages}
              columns={columns}
              isLoading={harvestBatchStore.isLoading}
          />
        </div>
        <HarvestBatchEditor
          cultivation_batches={this.props.cultivation_batches}
          uoms={this.props.uoms}
          facility_id={this.props.facility_id}
          onSave={this.onSave}
          canUpdate={plantPermission.update}
          canCreate={plantPermission.create}
        />
      </React.Fragment>
    )
  }
}

export default HarvestbatchSetupApp
