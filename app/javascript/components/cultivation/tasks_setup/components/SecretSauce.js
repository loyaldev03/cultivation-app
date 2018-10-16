import React from 'react'
import { render } from 'react-dom'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import update from 'immutability-helper'

import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'
import NutrientProfileStore from '../stores/NutrientProfileStore'


@observer
class SecretSauce extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: this.props.batch,
      nutrients: NutrientProfileStore.nutrients,
      id: NutrientProfileStore.id
    }
  }

  handleChange = (category, name, value) => {
    // let oldContents = this.state.nutrients;
    // let newContents = update(oldContents, { [key]: { $set: input } });
    // this.handleChange('nutrients', newContents);
    console.log(category)
    console.log(name)

    console.log(value)

    let index = this.state.nutrients.findIndex(e => e.category === category && e.name === name)
    this.setState({
      nutrients: update(this.state.nutrients, { [index]: { value: { $set: value } } })
    })


  };

  findAttr(category, name){
    let nutrient = this.state.nutrients.find(e => e.category === category && e.name === name)
    if(nutrient === undefined){
      nutrient = {category: category, name: name, value: ''}
      this.setState(prevState => ({
        nutrients: [...prevState.nutrients,
        nutrient]
      }))
      return nutrient
    }
    else{
      return nutrient
    }
  }

  render() {
    return (
      <React.Fragment>
        <h4 class="gray f6">Below is the Optimal Nutrient Profile {JSON.stringify(this.state.nutrients)}</h4>
        <div class="flex f6">
          <div class="w-30">
            <h4 class="gray f6">Vegetative</h4>
            <div class="flex">
              <div class="w-40">
                <label>Nitrogen (N)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('vegetative', 'nitrogen').value}
                  onChange={e => this.handleChange('vegetative', 'nitrogen', e.target.value)}
                  fieldname="nitrogen"
                  errors={this.state.errors}
                  errorField="nitrogen"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Phosphorus (P)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('vegetative', 'phosphorus').value}
                  onChange={e => this.handleChange('vegetative', 'phosphorus', e.target.value)}
                  fieldname="vegetative_phosphorus"
                  errors={this.state.errors}
                  errorField="navegetative_phosphorusme"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Potassium (K)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('vegetative', 'potassium').value}
                  onChange={e => this.handleChange('vegetative', 'potassium', e.target.value)}
                  fieldname="vegetative_potassium"
                  errors={this.state.errors}
                  errorField="vegetative_potassium"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Magnesium (Mg)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('vegetative', 'magnesium').value}
                  onChange={e => this.handleChange('vegetative', 'magnesium', e.target.value)}
                  fieldname="vegetative_magnesium"
                  errors={this.state.errors}
                  errorField="vegetative_magnesium"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Calcium (Ca)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('vegetative', 'calcium').value}
                  onChange={e => this.handleChange('vegetative', 'calcium', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Sulfer (S)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('vegetative', 'sulfer').value}
                  onChange={e => this.handleChange('vegetative', 'sulfer', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Boron (B)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('vegetative', 'boron').value}
                  onChange={e => this.handleChange('vegetative', 'boron', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Iron (Fe)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('vegetative', 'iron').value}
                  onChange={e => this.handleChange('vegetative', 'iron', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Zinc (Zn)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('vegetative', 'zinc').value}
                  onChange={e => this.handleChange('vegetative', 'zinc', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Molybdenum (Mo)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('vegetative', 'molybdenum').value}
                  onChange={e => this.handleChange('vegetative', 'molybdenum', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
          </div>
          <div class="w-30">
            <h4 class="gray f6">Flowering</h4>
            <div class="flex">
              <div class="w-40">
                <label>Nitrogen (N)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('flowering', 'nitrogen').value}
                  onChange={e => this.handleChange('flowering', 'nitrogen', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Phosphorus (P)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('flowering', 'phosphorus').value}
                  onChange={e => this.handleChange('flowering', 'phosphorus', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Potassium (K)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('flowering', 'potassium').value}
                  onChange={e => this.handleChange('flowering', 'potassium', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Magnesium (Mg)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('flowering', 'magnesium').value}
                  onChange={e => this.handleChange('flowering', 'magnesium', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Calcium (Ca)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('flowering', 'calcium').value}
                  onChange={e => this.handleChange('flowering', 'calcium', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Sulfer (S)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('flowering', 'sulfer').value}
                  onChange={e => this.handleChange('flowering', 'sulfer', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Boron (B)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('flowering', 'boron').value}
                  onChange={e => this.handleChange('flowering', 'boron', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Iron (Fe)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('flowering', 'iron').value}
                  onChange={e => this.handleChange('flowering', 'iron', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Zinc (Zn)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('flowering', 'zinc').value}
                  onChange={e => this.handleChange('flowering', 'zinc', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-40">
                <label>Molybdenum (Mo)</label>
              </div>
              <div class="w-30">
                <TextInput
                  value={this.findAttr('flowering', 'molybdenum').value}
                  onChange={e => this.handleChange('flowering', 'molybdenum', e.target.value)}
                  fieldname="name"
                  errors={this.state.errors}
                  errorField="name"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="w-30 mt4 ">
          <a className="pointer flex-none bg-orange link white f6 fw6 pv2 ph3 br2 dim mt3">
            Save & Continue
          </a>
        </div>
      </React.Fragment>
    )
  }
}

export default SecretSauce
