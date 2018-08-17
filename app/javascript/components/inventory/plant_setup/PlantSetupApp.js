import React from 'react'
import PlantList from './components/PlantList'
import PlantEditor from './components/PlantEditor'
import plantStore from './store/PlantStore'
import addPlant from './actions/addPlant'

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
    return null
    // return (
    //   <div className="w-80">
    //     <PlantList />
    //   </div>
    // )
  }

  renderFirstTime() {
    return (
      <div className="mb3">
        <div className="w-50">
          <h1 className="mt0 f3 fw4 dark-gray">Setup active plant inventory</h1>
          <p className="gray mb3 lh-copy">
            Add your existing plant inventories. Do not worry if you are unable
            to add all the records, you can always continue later from the
            settings menu.
          </p>
          <p className="gray mb4 lh-copy">
            We recommend to prioritise on <strong>seed, clone</strong> and{' '}
            <strong>mother data</strong> so that you can proceed to do
            cultivation planning in the next phase of the setup.
          </p>
        </div>
        <button
          className="pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6 pointer"
          onClick={this.openSidebar}
        >
          Add my first plant
        </button>
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderFirstTime()}
        {this.renderPlantList()}
        <PlantEditor
          isOpened
          onClose={this.closeSidebar}
          strainTypes={this.props.strain_types}
          locations={this.props.locations}
        />
      </React.Fragment>
    )
  }
}

export default PlantSetupApp
