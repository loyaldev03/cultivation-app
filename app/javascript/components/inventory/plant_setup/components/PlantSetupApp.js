import React from 'react'
import PlantList from './PlantList'


class PlantSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.onAddPlant = this.onAddPlant.bind(this)
    this.openSidebar = this.openSidebar.bind(this)
  }

  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
  }

  openSidebar() {
    window.editorSidebar.open()
  }

  onAddPlant() {
    this.openSidebar()
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={this.openSidebar}>Add plant</button>
        <PlantList />
        <div className="rc-slide-panel animated slideOutRight" data-role="sidebar">
          <span className="rc-slide-panel__close-button dim">
            <i className="material-icons mid-gray md-18">close</i>
          </span>
          <div className="rc-slide-panel__body"></div>
        </div>
      </React.Fragment>
    )
  }

}

export default PlantSetupApp