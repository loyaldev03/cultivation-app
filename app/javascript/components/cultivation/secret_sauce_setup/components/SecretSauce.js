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
    NutrientProfileStore.loadNutrients(this.props.batchId, 'clone')
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
        <div class="flex justify-center">
          <span className="f6 b flex items-center mr2">Growth Schedule : </span>
          <div className="bg-orange f6 white pa2 br1 pointer">Clone (5w)</div>
          <div className="bg-white f6 grey pa2 bt bb b--light-gray pointer">
            Veg1 (3w)
          </div>
          <div className="bg-white f6 grey pa2 bt bb b--light-gray pointer">
            Veg2 (n/a)
          </div>
          <div className="bg-white f6 grey pa2 bt bb br b--light-gray pointer">
            Flower (8w)
          </div>
        </div>
        <div className="mt4 flex">
          <div className="w-20 pa3 mr2 h7">
            <div className="f6 h2 mt3" />
            <div className="f6 h2 mt3">Light hours (per day)</div>
            <div className="f6 h2 mt3">Temperature (day/night)</div>
            <div className="f6 h2 mt3">Humidity level</div>
            <div className="f6 h2 mt3">Water intake</div>
            <div className="f6 h2 mt3">Nutrients</div>
            <div className="f6 h2 mt3">Active ingredients</div>
          </div>
          <div className="w-25 pa3 mr2 h7 tc">
            <div className="f6 h2 mt3">Week 1</div>
            <div className="f6 h2 mt3">12h</div>
            <div className="f6 h2 mt3">77/64 F</div>
            <div className="f6 h2 mt3">75%</div>
            <div className="f6 h2 mt3">1l per plant 1,6 ph</div>
            <div className="f6 h2 mt3">Compose tea x 125ml, FP Grow x 4l</div>
            <div className="f6 h2 mt3">Na 8,2% CI 3,4% Ph 2,1%</div>
          </div>
          <div className="w-25 pa3 mr2 h7 tc">
            <div className="f6 h2 mt3">Week 2</div>
            <div className="f6 h2 mt3">12h</div>
            <div className="f6 h2 mt3">77/64 F</div>
            <div className="f6 h2 mt3">75%</div>
            <div className="f6 h2 mt3">1l per plant 1,6 ph</div>
            <div className="f6 h2 mt3">--</div>
            <div className="f6 h2 mt3">Na 8,2% CI 3,4% Ph 2,1%</div>
          </div>
          <div className="w-25 pa3 mr2 h7 tc">
            <div className="f6 h2 mt3">Week 3</div>
            <div className="f6 h2 mt3">Light hours (per day)</div>
            <div className="f6 h2 mt3">77/64 F</div>
            <div className="f6 h2 mt3">75%</div>
            <div className="f6 h2 mt3">1l per plant 1,6 ph</div>
            <div className="f6 h2 mt3">FP Grow x 125ml</div>
            <div className="f6 h2 mt3">--</div>
          </div>
          <div className="w-25 pa3 mr2 h7 tc">
            <div className="f6 h2 mt3">Week 4</div>
            <div className="f6 h2 mt3">Light hours (per day)</div>
            <div className="f6 h2 mt3">77/64 F</div>
            <div className="f6 h2 mt3">40%</div>
            <div className="f6 h2 mt3">1l per plant 1,6 ph</div>
            <div className="f6 h2 mt3">FP Grow x 125ml</div>
            <div className="f6 h2 mt3">Na 8,2% CI 3,4% Ph 2,1%</div>
          </div>
          <div className="w-25 pa3 mr2 h7 tc">
            <div className="f6 h2 mt3">Week 5</div>
            <div className="f6 h2 mt3">Light hours (per day)</div>
            <div className="f6 h2 mt3">77/64 F</div>
            <div className="f6 h2 mt3">35%</div>
            <div className="f6 h2 mt3">1l per plant 1,6 ph</div>
            <div className="f6 h2 mt3">FP Grow x 125ml</div>
            <div className="f6 h2 mt3">--</div>
          </div>
          <div className="w-25 pa3 mr2 h7 tc">
            <div className="f6 h2 mt3">Week 6</div>
            <div className="flex h5 items-center">
              <div className="center">
                <i className="material-icons bg-orange white br-100 pa2 pointer">
                  edit
                </i>
              </div>
            </div>
            {/* <div className="f6 h2 mt3">Light hours (per day)</div>
            <div className="f6 h2 mt3">77/64 F</div>
            <div className="f6 h2 mt3">35%</div>
            <div className="f6 h2 mt3">1l per plant 1,6 ph</div>
            <div className="f6 h2 mt3">FP Grow x 125ml</div>
            <div className="f6 h2 mt3">--</div> */}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default SecretSauce
