import React, { lazy } from 'react'
import { observer } from 'mobx-react'
import {
  SlidePanelHeader,
  SlidePanelFooter,
  selectStyles
} from '../../../utils'
import InputRange from 'react-input-range'
import 'react-input-range/lib/css/index.css'
import Select from 'react-select'
import NutrientProfileStore from '../store/NutrientProfileStore'
import Tippy from '@tippy.js/react'

const styles = `
.input-range__track--active {
    background: #F66830;
}
.input-range__slider {
    background: #F66830;
    border: 1px solid #F66830;
}
`
const MenuButton = ({ text, onClick, className = '' }) => {
  return (
    <a
      className={`pa2 flex link dim pointer items-center ${className}`}
      onClick={onClick}
    >
      <span className="pr2">{text}</span>
    </a>
  )
}

@observer
class NutrientForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedWeek: '',
      light_hours: '',
      temperature_day: '',
      temperature_night: '',
      humidity_level: '',
      water_intake_value: '',
      water_intake_uom: 'gallon',
      water_ph: '',
      water_frequency_value: '',
      water_frequency_uom: 'daily',
      dissolveNutrients: []
    }
  }
  componentDidMount() {
    this.setState({
      nutrientProducts: NutrientProfileStore.getNutrientProducts()
    })
    // get water_intake_uom values eg: gallon
    // get water_intake_usage_uom eg: daily
  }
  setSelectedWeek(week) {
    this.setState({
      selectedWeek: week.name,
      light_hours: week.light_hours,
      temperature_day: week.temperature_day,
      temperature_night: week.temperature_night,
      humidity_level: week.humidity_level,
      water_intake_value: week.water_intake_value,
      water_intake_uom: week.water_intake_uom,
      water_ph: week.water_ph,
      water_frequency_value: week.water_frequency_value,
      water_frequency_uom: week.water_frequency_uom,
      dissolveNutrients: week.dissolveNutrients
    })
  }
  onSave = async () => {
    await this.props.onSave(this.state)
  }

  addDissolveNutrient = () => {
    const newDissolveNutrient = {
      amount: '',
      amount_uom: 'mg',
      ppm: '',
      product: { value: '', label: '' },
      active_ingredients: ''
    }
    const newDissolveNutrients = [
      ...this.state.dissolveNutrients,
      newDissolveNutrient
    ]
    this.setState({
      dissolveNutrients: newDissolveNutrients
    })
  }

  removeDissolveNutrient = e => {
    this.setState({
      dissolveNutrients: this.state.dissolveNutrients.filter(a => a !== e)
    })
  }

  onChangeDissolveNutrientAttr = (record, key, value) => {
    let updated_nutrient = this.state.dissolveNutrients.find(e => e === record)
    updated_nutrient[key] = value
    if (key === 'product') {
      updated_nutrient.product_id = value.value
      updated_nutrient.ppm = value.ppm
      const display_nutrients = value.nutrients
        .map(e => `${e.element}, ${e.value}%`)
        .join()
      updated_nutrient.active_ingredients = display_nutrients
    }

    const updated_nutrients = this.state.dissolveNutrients.map(t => {
      return t === record ? updated_nutrient : t
    })

    this.setState({
      dissolveNutrients: updated_nutrients
    })
  }

  onChangeInput = field => e => this.setState({ [field]: e.target.value })

  onChangeWaterUom = value => {
    console.log(value)
    this.setState({ water_intake_uom: value })
    this.tippy.hide()
  }

  onCreateTippy = tippy => {
    this.tippy = tippy
  }

  render() {
    const { onClose } = this.props
    const {
      light_hours,
      temperature_day,
      humidity_level,
      water_intake_value,
      water_intake_uom,
      water_frequency_value,
      water_frequency_uom,
      water_ph,
      dissolveNutrients
    } = this.state
    const nutrientProducts = NutrientProfileStore.getNutrientProducts()
    return (
      <div className="flex flex-column h-100">
        <style>{styles}</style>
        <SlidePanelHeader onClose={onClose} title={this.state.selectedWeek} />
        <div className="flex flex-column flex-auto justify-between">
          <div className="pa3 flex flex-column">
            <div className="flex">
              <div className="w-20">
                <label className="">Light (daily)</label>
                <div className="flex mt2">
                  <input
                    id="name"
                    className="input-reset ba b--light-gray br2 br--left pa2 mb2 db w-40"
                    type="text"
                    aria-describedby="name-desc"
                    value={light_hours}
                    onChange={this.onChangeInput('light_hours')}
                  />
                  <div className="bt bb br b--light-gray pa2 mb2 db br2 br--right bg-light-gray gray w-30 tc">
                    h
                  </div>
                </div>
              </div>
              <div className="w-30">
                <label className="">Temp. (day/night)</label>
                <div className="flex mt2">
                  <input
                    id="name"
                    className="input-reset ba b--light-gray br2 br--left pa2 mb2 db w-50"
                    type="text"
                    aria-describedby="name-desc"
                    onChange={this.onChangeInput('temperature_day')}
                    value={temperature_day}
                  />
                  <div className="bt bb br b--light-gray pa2 mb2 db br2 br--right bg-light-gray gray w-20 tc">
                    F
                  </div>
                </div>
              </div>
            </div>
            <div className="mt3">
              <div className="mb3">Humidity level (%)</div>
              <div className="pa2">
                <InputRange
                  maxValue={100}
                  minValue={0}
                  value={humidity_level}
                  onChange={value => this.setState({ humidity_level: value })}
                />
              </div>
            </div>
            <div className="mt3">
              <div className="flex">
                <div className="w-30">
                  <label className="">Watering intake</label>
                  <div className="flex mt2">
                    <input
                      id="name"
                      className="input-reset ba b--light-gray br2 br--left pa2 mb2 db w-40"
                      type="text"
                      aria-describedby="name-desc"
                      value={water_intake_value}
                      onChange={this.onChangeInput('water_intake_value')}
                    />
                    <div className="bt bb br b--light-gray pa2 mb2 db br2 pointer br--right bg-light-gray gray w-60 tc">
                      <Tippy
                        placement="bottom-end"
                        trigger="click"
                        arrow={true}
                        interactive={true}
                        onCreate={this.onCreateTippy}
                        content={
                          <div className="bg-white f6 flex grey mt2">
                            <div className="db shadow-4">
                              <MenuButton
                                text="ml"
                                onClick={e => this.onChangeWaterUom('ml')}
                              />
                              <MenuButton
                                text="l"
                                onClick={e => this.onChangeWaterUom('l')}
                              />
                              <MenuButton
                                text="gal"
                                onClick={e => this.onChangeWaterUom('gal')}
                              />
                            </div>
                          </div>
                        }
                      >
                        <div>
                          <span>{water_intake_uom}</span>
                          <i className={'material-icons grey md-14 ml2'}>
                            keyboard_arrow_down
                          </i>
                        </div>
                      </Tippy>
                    </div>
                  </div>
                </div>
                <div className="flex items-center f3 ml1 mr1">x</div>
                <div className="w-30">
                  <div className="h1" />
                  <div className="flex mt2">
                    <input
                      id="name"
                      className="input-reset ba b--light-gray br2 br--left pa2 mb2 db w-40"
                      type="text"
                      aria-describedby="name-desc"
                      value={water_frequency_value}
                      onChange={this.onChangeInput('water_frequency_value')}
                    />
                    <div className="bt bb br b--light-gray pa2 mb2 db br2 br--right bg-light-gray gray w-60 tc">
                      daily
                    </div>
                  </div>
                </div>
                <div className="w-30 ml3">
                  <div className="h1" />
                  <div className="flex mt2">
                    <input
                      id="name"
                      className="input-reset ba b--light-gray br2 br--left pa2 mb2 db w-30"
                      type="text"
                      aria-describedby="name-desc"
                      value={water_ph}
                      onChange={this.onChangeInput('water_ph')}
                    />
                    <div className="bt bb br b--light-gray pa2 mb2 db br2 br--right bg-light-gray gray w-20 tc">
                      PH
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt3">
              <label>Dissolve nutrients </label>
              {dissolveNutrients &&
                dissolveNutrients.map(e => (
                  <div
                    className="pa2 mt2"
                    style={{ background: 'rgba(238, 238, 238, 0.3)' }}
                  >
                    <Select
                      styles={selectStyles}
                      options={nutrientProducts}
                      value={e.product}
                      onChange={f =>
                        this.onChangeDissolveNutrientAttr(e, 'product', f)
                      }
                    />
                    <div className="flex">
                      <div className="w-30 mt2">
                        <div className="h1">Amount</div>
                        <div className="flex mt2">
                          <input
                            id="name"
                            className="input-reset ba b--light-gray br2 br--left pa2 mb2 db w-30"
                            type="text"
                            aria-describedby="name-desc"
                            value={e.amount}
                            onChange={f =>
                              this.onChangeDissolveNutrientAttr(
                                e,
                                'amount',
                                f.target.value
                              )
                            }
                          />
                          <div className="bt bb br b--light-gray pa2 mb2 db br2 br--right bg-light-gray gray w-20 tc">
                            mg
                          </div>
                        </div>
                      </div>
                      <div className="w-30 mt2">
                        <div className="h1">PPM</div>
                        <div className="flex mt3">{e.ppm}</div>
                      </div>
                      <div className="w-30 mt2">
                        <div className="h1" />
                        <div className="flex mt3">
                          <a
                            className="pointer orange underline"
                            onClick={f => this.removeDissolveNutrient(e)}
                          >
                            Remove
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <label>Active ingredients</label>
                      <label>({e.active_ingredients})</label>
                    </div>
                  </div>
                ))}
              <div
                className="pointer flex justify-center orange mt3 center items-center"
                onClick={this.addDissolveNutrient}
              >
                <span className="material-icons">add</span>
                <span>Add nutrient</span>
              </div>
            </div>
          </div>
          <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
        </div>
      </div>
    )
  }
}

// NutrientForm.defaultProps = {
//   // selectMode: 'multiple', // or 'single'
//   title: 'Update Nutrient Profile'
// }

export default NutrientForm
