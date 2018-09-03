import React from 'react'
import { observer } from 'mobx-react'
import PlantList from './components/PlantList'
import PlantEditor from './components/PlantEditor'
import plantStore from './store/PlantStore'
import loadPlants from './actions/loadPlants'
// import addPlant from './actions/addPlant'

@observer
class PlantSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.onAddPlant = this.onAddPlant.bind(this)
    this.openSidebar = this.openSidebar.bind(this)
    this.closeSidebar = this.closeSidebar.bind(this)
  }

  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadPlants()
  }

  openSidebar() {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  closeSidebar() {
    window.editorSidebar.close()
  }

  onAddPlant() {
    this.openSidebar()
  }

  renderPlantList() {
    if (plantStore.plants.length === 0) {
      return null
    }

    return (
      <div className="w-80 bg-white pa3">
        <div className="flex mt3 mb4">
          <h1 className="mv0 f3 fw4 dark-gray  flex-auto">
            Active Plant Inventory
          </h1>
          <div style={{ justifySelf: 'end' }}>
            <button
              className="pv2 ph3 bg-orange white bn br2 ttc tracked link dim f6 fw6 pointer"
              onClick={this.openSidebar}
            >
              Add plant
            </button>
          </div>
        </div>
        <PlantList />
      </div>
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
        <PlantEditor
          isOpened={false}
          onClose={this.closeSidebar}
          strainTypes={this.props.strain_types}
          locations={this.props.locations}
        />
      </React.Fragment>
    )
  }
}

export default PlantSetupApp
