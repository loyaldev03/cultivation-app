import React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { NUTRITION_LIST } from '../../../utils'
import NutrientProfileStore from '../store/NutrientProfileStore'
import SaveNutrientProfile from '../actions/saveNutrientProfile'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

const SAUSE_TABS = [
  ['nutrients', 'Nutrients'],
  ['light', 'Light'],
  ['temperature', 'Temperature / Moisture']
]

@observer
class SecretSauce extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabIndex: 0,
      batch: this.props.batch,
      nutrients: NutrientProfileStore.nutrients,
      id: NutrientProfileStore.id,
      tabs: 'nutrients',
      phase: 'clone'
    }
  }

  handleSubmit = () => {
    SaveNutrientProfile.saveNutrientProfile(this.state)
  }

  onSelectTab = tabIndex => {
    this.setState({ tabIndex })
  }

  render() {
    const { phase, tabIndex } = this.state
    return (
      <React.Fragment>
        <div className="flex">
          <div className="w4 pt3">
            <ul className="list mt4 pl0">
              {['clone', 'veg1', 'veg2', 'flower'].map(x => {
                return (
                  <li key={x} className="ml2 mr4 mv2">
                    <a
                      className={classNames(
                        'f6 f5-ns db pa2 link dim mid-gray pointer ttc',
                        {
                          'ba b--orange orange': phase === x,
                          'ba b--light-grey': phase !== x
                        }
                      )}
                      onClick={e => this.setState({ phase: x })}
                    >
                      {x}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="w-80">
            <Tabs
              className="react-tabs--primary react-tabs--secret-sause"
              selectedIndex={tabIndex}
              onSelect={this.onSelectTab}
            >
              <TabList>
                {SAUSE_TABS.map(x => (
                  <Tab key={x[0]}>{x[1]}</Tab>
                ))}
              </TabList>
              {SAUSE_TABS.map(x => (
                <TabPanel key={x[0]}>
                  {x[0] === 'nutrients' && (
                    <div className="pa3">
                      <span className="pa1 f6 f5-ns db mb3 ttc fw6">
                        {phase}
                      </span>
                      {NUTRITION_LIST.map(x => {
                        return (
                          <div key={x.element} className="flex mb2">
                            <span className="w4 pa1">{x.label}</span>
                            <span className="w3 pa1 tr">9.99%</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {x[0] !== 'nutrients' && <div className="pa3">&nbsp;</div>}
                </TabPanel>
              ))}
            </Tabs>

            <div className="flex justify-end pv3">
              <a className="btn btn--primary" onClick={this.handleSubmit}>
                Save &amp; Continue
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default SecretSauce
