import React from 'react'
import { render } from 'react-dom'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import update from 'immutability-helper'

import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'
import NutrientProfileStore from '../stores/NutrientProfileStore'
import SaveNutrientProfile from '../actions/saveNutrientProfile'

@observer
class SecretSauce extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch_id: this.props.batch_id,
      batch: this.props.batch,
      nutrients: NutrientProfileStore.nutrients,
      id: NutrientProfileStore.id,
      tabs: 'nutrients',
      phase: 'clone'
    }
  }

  handleChange = (category, name, value) => {
    let index = this.state.nutrients.findIndex(
      e => e.category === category && e.name === name
    )
    this.setState({
      nutrients: update(this.state.nutrients, {
        [index]: { value: { $set: value } }
      })
    })
  }

  findAttr(category, name) {
    let nutrient = this.state.nutrients.find(
      e => e.category === category && e.name === name
    )
    if (nutrient === undefined) {
      nutrient = { category: category, name: name, value: '' }
      this.setState(prevState => ({
        nutrients: [...prevState.nutrients, nutrient]
      }))
      return nutrient
    } else {
      return nutrient
    }
  }

  handleSubmit = () => {
    SaveNutrientProfile.saveNutrientProfile(this.state)
  }

  renderTabsClass = value => {
    if (this.state.tabs === value) {
      return 'link bb-r br-r bt-l br-l pv3 ph4 b--black-10 f6 fw6 dark-gray hover-bg-light-gray bg-white'
    } else {
      return 'link bt-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white'
    }
  }

  handleChangeTabs = value => {
    this.setState({ tabs: value })
  }

  handleChangePhase = value => {
    this.setState({ phase: value })
  }

  render() {
    let handleSubmit = this.handleSubmit
    let handleChangeTabs = this.handleChangeTabs
    let renderTabsClass = this.renderTabsClass
    let handleChangePhase = this.handleChangePhase
    return (
      <React.Fragment>
        <div className="flex">
          <div className="w-20"></div>
          <div className="w-80">
            <div className="flex">
              <a
                className={renderTabsClass('nutrients') + ' bl-l'} 
                onClick={e => handleChangeTabs('nutrients')}
              >
                Nutrients
              </a>
              <a
                className={renderTabsClass('light')}
                onClick={e => handleChangeTabs('light')}
              >
                Light
              </a>

              <a
                className={renderTabsClass('temp')}
                onClick={e => handleChangeTabs('temp')}
              >
                Temp/ Moisture
              </a>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-20">
            <ul className="list mt4">
              <li className="mb2">
                <a 
                  className="f6 f5-ns db pa2 link dim mid-gray pointer" 
                  onClick={e => handleChangePhase('clone')}
                >
                  Clone
                </a>
              </li>
              <li className="mb2">
                <a 
                  className="f6 f5-ns db pa2 link dim mid-gray pointer" 
                  onClick={e => handleChangePhase('vegetative')}
                >
                  Veg1
                </a>
              </li>
              <li className="mb2">
                <a 
                  className="f6 f5-ns db pa2 link dim mid-gray pointer" 
                  onClick={e => handleChangePhase('vegetative')}
                >
                  Veg2
                </a>
              </li>
              <li className="mb2">
                <a 
                  className="f6 f5-ns db pa2 link dim mid-gray pointer" 
                  onClick={e => handleChangePhase('flowering')}
                >
                  Flower
                </a>
              </li>
            </ul>
          </div>
          <div className="w-60 ba b--black-10">
            <div className="pa4">
              <div className="flex f6 ml4">
                <div className="w-50">
                  <span className="f6 f5-ns db mb4">{this.state.phase}</span>
                  <div className="flex mb2">
                    <div className="w-50">
                      <label>Nitrogen (N)</label>
                    </div>
                    <div className="w-50">
                      <TextInput
                        value={this.findAttr(this.state.phase, 'nitrogen').value}
                        onChange={e =>
                          this.handleChange(
                            this.state.phase,
                            'nitrogen',
                            e.target.value
                          )
                        }
                        fieldname="nitrogen"
                        errors={this.state.errors}
                        errorField="nitrogen"
                      />
                    </div>
                  </div>
                  <div className="flex mb2">
                    <div className="w-50">
                      <label>Phosphorus (P)</label>
                    </div>
                    <div className="w-50">
                      <TextInput
                        value={this.findAttr(this.state.phase, 'phosphorus').value}
                        onChange={e =>
                          this.handleChange(
                            this.state.phase,
                            'phosphorus',
                            e.target.value
                          )
                        }
                        fieldname="vegetative_phosphorus"
                        errors={this.state.errors}
                        errorField="navegetative_phosphorusme"
                      />
                    </div>
                  </div>
                  <div className="flex mb2">
                    <div className="w-50">
                      <label>Potassium (K)</label>
                    </div>
                    <div className="w-50">
                      <TextInput
                        value={this.findAttr(this.state.phase, 'potassium').value}
                        onChange={e =>
                          this.handleChange(
                            this.state.phase,
                            'potassium',
                            e.target.value
                          )
                        }
                        fieldname="vegetative_potassium"
                        errors={this.state.errors}
                        errorField="vegetative_potassium"
                      />
                    </div>
                  </div>
                  <div className="flex mb2">
                    <div className="w-50">
                      <label>Magnesium (Mg)</label>
                    </div>
                    <div className="w-50">
                      <TextInput
                        value={this.findAttr(this.state.phase, 'magnesium').value}
                        onChange={e =>
                          this.handleChange(
                            this.state.phase,
                            'magnesium',
                            e.target.value
                          )
                        }
                        fieldname="vegetative_magnesium"
                        errors={this.state.errors}
                        errorField="vegetative_magnesium"
                      />
                    </div>
                  </div>
                  <div className="flex mb2">
                    <div className="w-50">
                      <label>Calcium (Ca)</label>
                    </div>
                    <div className="w-50">
                      <TextInput
                        value={this.findAttr(this.state.phase, 'calcium').value}
                        onChange={e =>
                          this.handleChange(
                            this.state.phase,
                            'calcium',
                            e.target.value
                          )
                        }
                        fieldname="name"
                        errors={this.state.errors}
                        errorField="name"
                      />
                    </div>
                  </div>
                  <div className="flex mb2">
                    <div className="w-50">
                      <label>Sulfer (S)</label>
                    </div>
                    <div className="w-50">
                      <TextInput
                        value={this.findAttr(this.state.phase, 'sulfer').value}
                        onChange={e =>
                          this.handleChange(
                            this.state.phase,
                            'sulfer',
                            e.target.value
                          )
                        }
                        fieldname="name"
                        errors={this.state.errors}
                        errorField="name"
                      />
                    </div>
                  </div>
                  <div className="flex mb2">
                    <div className="w-50">
                      <label>Boron (B)</label>
                    </div>
                    <div className="w-50">
                      <TextInput
                        value={this.findAttr(this.state.phase, 'boron').value}
                        onChange={e =>
                          this.handleChange(this.state.phase, 'boron', e.target.value)
                        }
                        fieldname="name"
                        errors={this.state.errors}
                        errorField="name"
                      />
                    </div>
                  </div>
                  <div className="flex mb2">
                    <div className="w-50">
                      <label>Iron (Fe)</label>
                    </div>
                    <div className="w-50">
                      <TextInput
                        value={this.findAttr(this.state.phase, 'iron').value}
                        onChange={e =>
                          this.handleChange(this.state.phase, 'iron', e.target.value)
                        }
                        fieldname="name"
                        errors={this.state.errors}
                        errorField="name"
                      />
                    </div>
                  </div>
                  <div className="flex mb2">
                    <div className="w-50">
                      <label>Zinc (Zn)</label>
                    </div>
                    <div className="w-50">
                      <TextInput
                        value={this.findAttr(this.state.phase, 'zinc').value}
                        onChange={e =>
                          this.handleChange(this.state.phase, 'zinc', e.target.value)
                        }
                        fieldname="name"
                        errors={this.state.errors}
                        errorField="name"
                      />
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-50">
                      <label>Molybdenum (Mo)</label>
                    </div>
                    <div className="w-50">
                      <TextInput
                        value={this.findAttr(this.state.phase, 'molybdenum').value}
                        onChange={e =>
                          this.handleChange(
                            this.state.phase,
                            'molybdenum',
                            e.target.value
                          )
                        }
                        fieldname="name"
                        errors={this.state.errors}
                        errorField="name"
                      />
                    </div>
                  </div>
                </div>  
              </div>
            </div>
            <div className="flex justify-end pa2">
              <a
                className="pointer bg-orange link white f6 fw6 pv2 ph3 br2 dim mt3"
                onClick={handleSubmit}
              >
                Save & Continue
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default SecretSauce
