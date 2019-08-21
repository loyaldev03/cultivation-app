import React from 'react'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import MotherEditor from './components/editor/MotherEditor'
import plantStore from './store/PlantStore'
import loadPlants from './actions/loadPlants'

const columns = [
  {
    Header: 'Plant ID',
    accessor: 'attributes.plant_id',
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
    Header: 'Strain',
    accessor: 'attributes.strain_name',
    headerStyle: { textAlign: 'left' }
  },
  {
    Header: 'Growth stage',
    accessor: 'attributes.current_growth_stage',
    headerStyle: { textAlign: 'left' },
    Cell: props => (
      <span>{props.value.charAt(0).toUpperCase() + props.value.substr(1)}</span>
    )
  },
  {
    Header: 'Planted On',
    accessor: 'attributes.planting_date',
    headerStyle: { textAlign: 'left' },
    Cell: props => {
      const d = new Date(props.value)
      if (props.value) {
        return (
          <span>{`${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`}</span>
        )
      } else {
        return ''
      }
    }
  },
  {
    Header: 'Location',
    accessor: 'attributes.location_name',
    headerStyle: { textAlign: 'left' },
    width: 180
  }
]

function openStrain(event, id) {
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

@observer
class PlantSetupApp extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadPlants('mother', '', this.props.facility_id)
  }

  openSidebar() {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  render() {
    const { plantPermission } = this.props
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

          <ReactTable
            columns={columns}
            pagination={{ position: 'top' }}
            data={plantStore.bindablePlants}
            showPagination={false}
            pageSize={30}
            minRows={5}
            filterable
            className="f6 -highlight"
            showPagination={plantStore.plants.length > 30}
          />
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
