import React from 'react'
import classNames from 'classnames'
import { NUTRITION_LIST } from '../../../utils'
import NutrientProfileStore from '../store/NutrientProfileStore'
import SaveNutrientProfile from '../actions/saveNutrientProfile'
import { NutrientList, NutrientsAdded } from './NutrientsAdded'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

const SAUSE_TABS = [
  ['nutrients', 'Nutrients'],
  ['light', 'Light'],
  ['temperature', 'Temperature / Moisture']
]

class SecretSauce extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabIndex: 0,
      batch: this.props.batch,
      id: NutrientProfileStore.id,
      tabs: 'nutrients',
      phase: 'clone'
    }
  }

  componentDidMount() {
    NutrientProfileStore.loadNutrients(this.props.batchId, "clone")
  }

  handleSubmit = () => {
    SaveNutrientProfile.saveNutrientProfile(this.state)
  }

  onSwitchPhase = phase => e => {
    NutrientProfileStore.loadNutrients(this.props.batchId, phase)
    this.setState({ phase })
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
                      onClick={this.onSwitchPhase(x)}
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
                      <div className="flex">
                        <NutrientList className="flex flex-column" />
                        <NutrientsAdded className="flex flex-column" phase={phase} />
                      </div>
                    </div>
                  )}
                  {x[0] !== 'nutrients' && <div className="h5">&nbsp;</div>}
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
