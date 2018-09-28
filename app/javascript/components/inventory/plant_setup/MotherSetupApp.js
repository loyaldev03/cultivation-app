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
      if (props.value || props.value.length > 0) {
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
      <a href="#" onClick={event => openStrain(event, x.index)}>
        <i className="material-icons gray">more_horiz</i>
      </a>
    )
  }
]

function openStrain(event, index) {
  // const id = plantStore.strains.slice()[index].id
  window.editorSidebar.open({ width: '500px' })
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

  onAddPlant = () => {
    this.openSidebar()
  }

  renderPlantList() {
    return (
      <React.Fragment>
        <div className="flex mb0">
          <a
            href="#"
            className="link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 dark-gray hover-bg-light-gray bg-white"
          >
            Mother Plants
          </a>
          <a
            href="#"
            className="link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white"
          >
            Cultivation Batches
          </a>
          <a
            href="#"
            className="link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white"
          >
            Clones/ Plantings
          </a>
          <a
            href="#"
            className="link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white"
          >
            Veg
          </a>
          <a
            href="#"
            className="link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white"
          >
            Flower
          </a>
          <a
            href="#"
            className="link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white"
          >
            Harvest Batches
          </a>
        </div>

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
            data={plantStore.motherPlants}
            showPagination={false}
            pageSize={30}
            minRows={5}
            filterable
            className="f6"
            showPagination={plantStore.plants.length > 30}
          />
        </div>
      </React.Fragment>
    )
  }

  renderFirstTime() {
    if (plantStore.plants.length > 10) {
      return null
    }

    return (
      <div className="pa4 mb4 bg-white w-80">
        <h1 className="mt0 mb4 f3 fw4 dark-gray">
          Setup active plant inventory
        </h1>
        <p className="mb3 lh-copy f5 grey w-60">
          Add your existing plant inventories. Do not worry if you are unable to
          add all the records, you can always continue later from the settings
          menu.
        </p>
        <p className="mb3 lh-copy f5 grey w-60">
          We recommend to prioritise to start with{' '}
          <strong>cultivation batches </strong>
          follow by <strong>mother and clones</strong> so that you can proceed
          to do cultivation planning in the next phase of the setup.
        </p>
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderFirstTime()}
        {this.renderPlantList()}
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
