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
    accessor: 'attributes.serial_no',
    headerStyle: { textAlign: 'left' }
  },
  {
    Header: 'Strain',
    accessor: 'attributes.item_name',
    headerStyle: { textAlign: 'left' }
  },
  {
    Header: 'Growth stage',
    accessor: 'attributes.plant_status',
    headerStyle: { textAlign: 'left' },
    Cell: props => (
      <span>{props.value.charAt(0).toUpperCase() + props.value.substr(1)}</span>
    )
  },
  {
    Header: 'Planted On',
    accessor: 'attributes.planted_on',
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
      <a href="#" onClick={() => openStrain(x.index)}>
        <i className="material-icons gray">more_horiz</i>
      </a>
    )
  }
]

@observer
class PlantSetupApp extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadPlants()
  }

  openSidebar() {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  onAddPlant = () => {
    this.openSidebar()
  }

  renderPlantList() {
    if (plantStore.plants.length === 0) {
      return null
    }

    return (
      <React.Fragment>
        <div className="flex mb0">
          <a href="#" className="link ba pv3 ph4 b--black-10 f6 fw6 dark-gray hover-bg-light-gray bg-white">
            Mother Plants
          </a>
          <a href="#" className="link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white">
            Cultivation Batches
          </a>
          <a href="#" className="link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white">
            Clones/ Plantings
          </a>
          <a href="#" className="link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white">
            Veg
          </a>
          <a href="#" className="link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white">
            Flower
          </a>
          <a href="#" className="link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white">
            Harvest Batches
          </a>
        </div>
      
        <div className="w-80 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">
              Mother Plants
            </h1>
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
            minRows={30}
            filterable
            className="f6"
            showPagination={plantStore.plants.length > 30}
          />
        </div>
      </React.Fragment>
    )
  }

  renderFirstTime() {
    if (plantStore.plants.length > 0) {
      return null
    }

    return (
      <div className="ph4 pt4 pb5 mb3 bg-white w-70">
        <div className="w-60">
          <h1 className="mt0 mb4 f3 fw4 dark-gray">
            Setup active plant inventory
          </h1>
          <p className="mb3 lh-copy f5 grey">
            Add your existing plant inventories. Do not worry if you are unable
            to add all the records, you can always continue later from the
            settings menu.
          </p>
          <p className="mb4 lh-copy f5 grey">
            We recommend to prioritise on <strong>seed, clone</strong> and{' '}
            <strong>mother data</strong> so that you can proceed to do
            cultivation planning in the next phase of the setup.
          </p>
          <button
            className="pv2 ph3 bg-orange white bn br2 ttc tracked link dim f6 fw6 pointer"
            onClick={this.openSidebar}
          >
            Add my first plant
          </button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderFirstTime()}
        {this.renderPlantList()}
        <MotherEditor isOpened={false} locations={this.props.locations} />
      </React.Fragment>
    )
  }
}

export default PlantSetupApp
