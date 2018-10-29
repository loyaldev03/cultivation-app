import React from 'react'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import MotherEditor from './components/editor/MotherEditor'
import plantStore from './store/PlantStore'
import loadPlants from './actions/loadPlants'

const columns = [
  {
    Header: '',
    accessor: 'attributes.status',
    filterable: false,
    width: 30,
    Cell: props => {
      let color = 'red'
      if (props.value === 'available') {
        color = '#00cc77'
      }
      return (
        <div className="flex justify-center items-center h-100">
          <span
            style={{
              width: '8px',
              height: '8px',
              color: 'green',
              borderRadius: '50%',
              backgroundColor: color
            }}
          />
        </div>
      )
    }
  },
  {
    Header: 'Plant ID',
    accessor: 'attributes.plant_id',
    headerStyle: { textAlign: 'left' }
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
    headerStyle: { textAlign: 'left' }
  },
  {
    Header: '',
    className: 'tc',
    filterable: false,
    maxWidth: 45,
    Cell: x => (
      <a href="#" onClick={event => openStrain(event, x.original.id)}>
        <i className="material-icons gray">more_horiz</i>
      </a>
    )
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
    loadPlants('mother')
  }

  openSidebar() {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  render() {
    return (
      <React.Fragment>
        <div className="w-80 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">Mother Plants</h1>
            <div style={{ justifySelf: 'end' }}>
              <button
                className="pv2 ph3 bg-orange white bn br2 ttc tracked link dim f6 fw6 pointer"
                onClick={this.openSidebar}
              >
                Add mother
              </button>
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
            className="f6"
            showPagination={plantStore.plants.length > 30}
          />
        </div>
        <MotherEditor
          isOpened={false}
          locations={this.props.locations}
          facilityStrains={this.props.facility_strains}
        />
      </React.Fragment>
    )
  }
}

export default PlantSetupApp
