import React from 'react'
import PlantList from './components/PlantList'
import PlantEditor from './components/PlantEditor'

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
    window.editorSidebar.open({ width: '500px' })
  }

  closeSidebar() {
    window.editorSidebar.close()
  }

  onAddPlant() {
    this.openSidebar()
  }

  render() {
    return (
      <React.Fragment>
        <div className="mb3">
          <button
            className="pv2 ph3 bg-green white bn br2 ttu tracked link dim f6 fw6 pointer"
            onClick={this.openSidebar}
          >
            Add plant
          </button>
        </div>
        <div className="w-80">
          <PlantList />
        </div>
        <PlantEditor onClose={this.closeSidebar} />
      </React.Fragment>
    )
  }
}

export default PlantSetupApp
