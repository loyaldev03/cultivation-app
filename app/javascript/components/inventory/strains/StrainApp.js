import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import StrainList from './components/StrainList'
import StrainEditor from './components/StrainEditor'
import loadStrains from './actions/loadStrains'
import {
  TempStrainWidgets,
  NoPermissionMessage,
  numberFormatter
} from '../../utils'

const Strainlist = ({
  title,
  count,
  className = '',
  loaded = true,
  dataclassName = 'f2',
  headerClassName = ''
}) => {
  return (
    <div
      className="flex items-center ba b--light-gray pa3 bg-white br2 mr1 mb1 "
      style={{ height: 150 + 'px', width: '25%' }}
    >
      {loaded ? (
        <div
          className={`flex ${headerClassName}`}
          style={{ flex: ' 1 1 auto' }}
        >
          <i
            className={`material-icons white bg-orange md-48 ${className}`}
            style={{ borderRadius: '50%' }}
          >
            spa
          </i>
          <div className="tc">
            <h1 className="f5 fw6 grey">{title}</h1>
            <b className={`${dataclassName} fw6 dark-grey`}>{count}</b>
          </div>
        </div>
      ) : (
        'loading...'
      )}
    </div>
  )
}
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
    const { strain_permission } = this.props
    return (
      <React.Fragment>
        {strain_permission.read && (
          <div>
            <div className="mb3 flex jutify-between">
              <Strainlist
                title="Total Strains"
                count={numberFormatter.format(10)}
                className="ma3"
                loaded={true}
              />
              <Strainlist
                title="Total Indica Strains"
                count={numberFormatter.format(5)}
                className="ma3"
                loaded={true}
              />
              <Strainlist
                title="Total Sativa Strains"
                count={numberFormatter.format(5)}
                className="ma3"
                loaded={true}
              />
              <Strainlist
                title="Total Hybrid Strains"
                count={numberFormatter.format(5)}
                className="ma3"
                loaded={true}
              />
              {/* <img src={TempStrainWidgets} /> */}
            </div>
            <div className="fl w-100 bg-white pa3">
              <div className="flex justify-between mt3 mb4">
                <h1 className="mv0 f3 fw4 dark-gray">Strains</h1>
                {strain_permission.create && (
                  <div>
                    <button
                      className="btn btn--primary btn--small"
                      onClick={this.openSidebar}
                    >
                      Add strain
                    </button>
                  </div>
                )}
              </div>
              <StrainList />
            </div>
            <StrainEditor
              isOpened={false}
              canUpdate={strain_permission.update}
              canCreate={strain_permission.create}
              facility_id={this.props.facility_id}
            />
          </div>
        )}
        {!strain_permission.read && (
          <div>
            <NoPermissionMessage />
          </div>
        )}
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
