import React, { lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { NUTRITION_LIST, SlidePanel } from '../../../utils'
import NutrientProfileStore from '../store/NutrientProfileStore'
import SaveNutrientProfile from '../actions/saveNutrientProfile'
import { NutrientList, NutrientsAdded } from './NutrientsAdded'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import NutrientForm from './NutrientForm'
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
      id: NutrientProfileStore.id,
      tabs: 'nutrients',
      phase: 'Clone',
      showEditNutrientPanel: false
    }
  }

  componentDidMount() {
    NutrientProfileStore.loadNutrientsByPhases(this.props.batchId).then(x => {
      this.setState({ phases: x })
    })
    NutrientProfileStore.loadProducts(this.props.batch.facility_id)
  }

  handleSubmit = () => {
    SaveNutrientProfile.saveNutrientProfile(this.state)
  }

  onSwitchPhase = phase_name => {
    NutrientProfileStore.setCurrentNutrientPhase(phase_name)
    this.setState({ phase: phase_name })
  }

  onSelectTab = tabIndex => {
    this.setState({ tabIndex })
  }

  handleShowNutrientForm = week => {
    this.nutrientForm.setSelectedWeek(week)
    this.setState({
      showEditNutrientPanel: !this.state.showEditNutrientPanel
    })
  }

  render() {
    const { phase, tabIndex, showEditNutrientPanel } = this.state
    const phases = NutrientProfileStore.getPhases()
    const currPhase = NutrientProfileStore.getCurrentPhase()

    return (
      <React.Fragment>
        <SlidePanel
          width="600px"
          show={showEditNutrientPanel}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <NutrientForm
                ref={form => (this.nutrientForm = form)}
                title={phase}
                facility_id={this.props.batch.facility_id}
                onClose={() =>
                  this.setState({ showEditNutrientPanel: false })
                }
                onSave={nutrient_data => {
                  NutrientProfileStore.updateWeekNutrient(this.props.batchId, phase, nutrient_data)
                  this.setState({ showEditNutrientPanel: false })
                }}
              />
            </Suspense>
          )}
        />
        <div class="flex justify-center">
          <span className="f6 b flex items-center mr2">Growth Schedule : </span>
          { phases && phases.map((e) => 
            <div 
              className={classNames('ttc', {
                'bg-orange f6 white pa2 br1 pointer': currPhase.phase_name === e.phase_name,
                'bg-white f6 grey pa2 bt bb b--light-gray pointer': currPhase.phase_name !== e.phase_name,
                'bl': phases[0] === e,
                'br': phases[phases.length - 1] === e,
              })}
              onClick={f => this.onSwitchPhase(e.phase_name)}
            >
              {e.phase_name} ({e.weeks.length}w)
            </div>
          )}
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
          {currPhase && currPhase.weeks && currPhase.weeks.map((e) =>
            <React.Fragment>
            { e.nutrient_enabled ? 
                <div className="w-25 pa3 mr2 h7 tc pointer" onClick={() => this.handleShowNutrientForm(e)}>
                <div className="f6 h2 mt3">{e.name}</div>
                <div className="f6 h2 mt3">{e.light_hours}</div>
                <div className="f6 h2 mt3">{e.temperature_day}/{e.temperature_night} F</div>
                <div className="f6 h2 mt3">{e.humidity_level}%</div>
                <div className="f6 h2 mt3">{e.water_intake_value}{e.water_intake_uom} per plant {e.water_frequency_value},{e.water_ph} ph</div>
                <div className="f6 h2 mt3">{e.dissolveNutrients.map(e => `${e.product_name} x ${e.amount}${e.amount_uom}`).join()}</div>
                  <div className="f6 h2 mt3">{e.dissolveNutrients.map(e => e.active_ingredients).join()} </div>
              </div>
              : 
              <div className="w-25 pa3 mr2 h7 tc">
                <div className="f6 h2 mt3">{e.name}</div>
                <div className="flex h5 items-center">
                  <div className="center">
                    <i className="material-icons bg-orange white br-100 pa2 pointer"
                      onClick={() => this.handleShowNutrientForm(e)}
                    >
                      edit
                  </i>
                  </div>
                </div>
              </div>
            }
            </React.Fragment>
          )}

        </div>
      </React.Fragment>
    )
  }
}

export default SecretSauce
