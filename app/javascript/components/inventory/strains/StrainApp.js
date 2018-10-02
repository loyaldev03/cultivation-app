import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import StrainList from './components/StrainList'
import StrainEditor from './components/StrainEditor'
import strainStore from './store/StrainStore'
import loadStrains from './actions/loadStrains'

@observer
class StrainApp extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadStrains()
  }

  openSidebar = () => {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  renderStrainList() {
    if (strainStore.strains.length === 0) {
      return null
    }

    return (
      <div className="w-80 bg-white pa3">
        <div className="flex mt3 mb4">
          <h1 className="mv0 f3 fw4 dark-gray  flex-auto">Strains</h1>
          <div style={{ justifySelf: 'end' }}>
            <button
              className="pv2 ph3 bg-orange white bn br2 ttc tracked link dim f6 fw6 pointer"
              onClick={this.openSidebar}
            >
              Add strain
            </button>
          </div>
        </div>
        <StrainList />
      </div>
    )
  }

  renderFirstTime() {
    if (strainStore.strains.length > 0) {
      return null
    }

    return (
      <div className="ph4 pt4 pb5 mb3 bg-white w-70">
        <div className="w-60">
          <h1 className="mt0 mb4 f3 fw4 dark-gray">
            Setup strains for my facility
          </h1>
          <p className="mb3 lh-copy f5 grey">
            Add strains grown at your facility.
          </p>
          <button
            className="pv2 ph3 bg-orange white bn br2 ttc tracked link dim f6 fw6 pointer"
            onClick={this.openSidebar}
          >
            Add my first strain
          </button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderFirstTime()}
        {this.renderStrainList()}
        <StrainEditor isOpened={false} locations={this.props.locations} />
      </React.Fragment>
    )
  }
}

StrainApp.propTypes = {
  facility_id: PropTypes.string.isRequired,
  locations: PropTypes.array.isRequired
}

StrainApp.defaultProps = {
  facility_id: null,
  locations: []
}

export default StrainApp
