import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import StrainList from './components/StrainList'
import StrainEditor from './components/StrainEditor'
import loadStrains from './actions/loadStrains'
import { TempStrainWidgets } from '../../utils'

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
        <div className="mb3 w-100 mw1200">
          <img src={TempStrainWidgets} />
        </div>
        <div className="fl w-100 mw1200 bg-white pa3">
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
