import React from 'react'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import MotherEditor from './components/editor/MotherEditor'
import PlantStore from './store/PlantStore'
import loadPlants from './actions/loadPlants'
import {
  ListingTable,
  HeaderFilter,
  formatDate2,
  CheckboxSelect
} from '../../utils'
import isEmpty from 'lodash.isempty'
import { differenceInDays } from 'date-fns'

function openStrain(event, id) {
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

@observer
class PlantSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          Header: 'Plant ID',
          accessor: 'plant_id',
          headerStyle: { textAlign: 'left' },
          Cell: x => (
            <a
              href="#0"
              className="link grey"
              onClick={event => openStrain(event, x.original.id)}
            >
              {x.value}
            </a>
          )
        },
        {
          Header: (
            <HeaderFilter
              title="Batch ID"
              accessor="cultivation_batch_name"
              getOptions={PlantStore.getUniqPropValues}
              onUpdate={PlantStore.updateFilterOptions}
            />
          ),
          accessor: 'cultivation_batch_name',
          headerStyle: { textAlign: 'left' },
          Cell: props => <span>{props.value || 'Unnamed Batch'}</span>
        },
        {
          Header: 'Strain',
          accessor: 'strain_name',
          headerStyle: { textAlign: 'left' }
        },
        {
          Header: 'Growth stage',
          accessor: 'current_growth_stage',
          headerStyle: { textAlign: 'left' },
          Cell: props => (
            <span>
              {props.value.charAt(0).toUpperCase() + props.value.substr(1)}
            </span>
          )
        },
        {
          Header: 'Planted On',
          accessor: 'planting_date',
          headerStyle: { textAlign: 'left' },
          Cell: props => (props.value ? formatDate2(props.value) : '--')
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
        },
        {
          Header: 'Location',
          accessor: 'location_name',
          headerStyle: { textAlign: 'left' },
          width: 180,
          Cell: props => (props.value ? props.value : '--')
        }
      ]
    }
  }
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadPlants('mother', '', this.props.facility_id)
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

  render() {
    const { plantPermission } = this.props
    const { columns } = this.state
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">Mother Plants</h1>
            <div style={{ justifySelf: 'end' }}>
              {plantPermission.create && (
                <div>
                  <button
                    className="btn btn--primary btn--small"
                    onClick={this.openSidebar}
                  >
                    Add mother
                  </button>
                </div>
              )}
            </div>
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
              columns={columns}
              data={PlantStore.filteredList}
              className="f6 -highlight"
              isLoading={PlantStore.isLoading}
            />
          </div>
        </div>
        <MotherEditor
          isOpened={false}
          facilityStrains={this.props.facility_strains}
          scanditLicense={this.props.scanditLicense}
          facility_id={this.props.facility_id}
          canUpdate={plantPermission.update}
          canCreate={plantPermission.create}
        />
      </React.Fragment>
    )
  }
}

export default PlantSetupApp
