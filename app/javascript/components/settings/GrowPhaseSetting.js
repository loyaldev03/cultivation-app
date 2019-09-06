import React from 'react'
import { observer } from 'mobx-react'
import { HeaderFilter, ListingTable } from '../utils'
import GrowPhaseEditor from './GrowPhaseEditor'
import GrowPhaseStore from './GrowPhaseStore'
import classNames from 'classnames'

@observer
class GrowPhaseSetting extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    GrowPhaseStore.loadGrowPhase()
  }

  onToggleActive = (id, value) => e => {
    e.stopPropagation()
    GrowPhaseStore.updateCategory(id, !value)
  }

  openGrowPhase(event, index) {
    const id = GrowPhaseStore.items.slice()[index].id
    window.editorSidebar.open({ width: '350px', grow_phase_id: id })
    event.preventDefault()
    event.stopPropagation()
  }

  render() {
    return (
      <React.Fragment>
        <div id="toast" className="toast" />
        <div className="mt0 ba b--light-grey pa3">
          <p className="grey">
            You can decide which phases to be used by setting it to "Active"
          </p>
          <table className="collapse ba b--light-grey box--br3 pv2 ph3 f6 mt4 w-100 mb2">
            <tbody>
              <tr className="bg-light-gray">
                <th className="pv2 ph3 subtitle-2 dark-grey tc">Name</th>
                <th className="pv2 ph3 subtitle-2 dark-grey tc">
                  # Days Of Propagation
                </th>
                <th className="pv2 ph3 subtitle-2 dark-grey tc">
                  Avg Days of Propagation
                </th>
                <th className="pv2 ph3 subtitle-2 dark-grey tc">Active</th>
              </tr>
              {GrowPhaseStore.filteredList.map((x, i) => (
                <tr
                  key={x.id}
                  className={classNames('dim pointer', { grey: !x.is_active })}
                  onClick={e => this.openGrowPhase(e, i)}
                >
                  <td className="bb b--black-20 pv3 tc ttc">{x.name}</td>
                  <td className="bb b--black-20 pv3 tc">{x.number_of_days}</td>
                  <td className="bb b--black-20 pv3 tc">
                    {x.number_of_days_avg}
                  </td>
                  <td className="bb b--black-20 pv3 tc">
                    <div className="center">
                      <input
                        type="checkbox"
                        className="toggle toggle-default"
                        onChange={() => {}}
                        checked={x.is_active}
                      />
                      <label
                        className="toggle-button center"
                        onClick={this.onToggleActive(x.id, x.is_active)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <GrowPhaseEditor isOpened={false} />
      </React.Fragment>
    )
  }
}

export default GrowPhaseSetting
