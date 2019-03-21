import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import StrainList from './components/StrainList'
import StrainEditor from './components/StrainEditor'
import loadStrains from './actions/loadStrains'

@observer
class StrainApp extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadStrains(this.props.facility_id)
  }

  openSidebar = () => {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  renderStrainList() {
    return (
      <div className="fl w-100-m w-80-l bg-white pa3">
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

  render() {
    return (
      <React.Fragment>
        <div className="ph4 pt4 pb4 mb3 bg-white w-80">
          <div className="w-80">
            <h1 className="mt0 mb3 f3 fw4 dark-gray">
              Setup strains for my facility
            </h1>
            <p className="mb0 lh-copy f5 grey">
              Register strains grown at my facility.
            </p>
          </div>
        </div>
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
  facility_id: '',
  locations: []
}

export default StrainApp
