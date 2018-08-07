import React from 'react'
import PlantList from './PlantList'
import PlantEditor from './PlantEditor'

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
    window.editorSidebar.open()
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
        <button onClick={this.openSidebar}>Add plant</button>
        <PlantList />
        <PlantEditor onClose={this.closeSidebar} />
      </React.Fragment>
    )
  }
}

export default PlantSetupApp
