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
        <div className="fl w-100-m w-80-l bg-white pa3">
          <div className="flex justify-between mt3 mb4">
            <h1 className="mv0 f3 fw4 dark-gray">Strains</h1>
            <button
              className="btn btn--primary btn--small"
              onClick={this.openSidebar}
            >
              Add strain
            </button>
          </div>
          <StrainList />
        </div>
        <StrainEditor isOpened={false} facility_id={this.props.facility_id} />
      </React.Fragment>
    )
  }
}

StrainApp.propTypes = {
  facility_id: PropTypes.string.isRequired
}

StrainApp.defaultProps = {
  facility_id: ''
}

export default StrainApp
