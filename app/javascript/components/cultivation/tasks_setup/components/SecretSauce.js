import React from 'react'
import { render } from 'react-dom'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'

@observer
class SecretSauce extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: this.props.batch
    }
  }

  render() {
    return (
      <React.Fragment>
        <div class="ba b--light-gray pa3">
          <h4 class="gray f6">Below is the Optimal Nutrient Profile</h4>
          <div class="flex">
            <div class="w-30">
              <h4 class="gray f6">Vegetative</h4>
              <div class="flex">
                <div class="w-40">
                  <label>Nitrogen (N)</label>
                </div>
                <div class="w-30">
                  <TextInput
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
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
                    value={this.state.name}
                    onChange={this.handleChangeTask}
                    fieldname="name"
                    errors={this.state.errors}
                    errorField="name"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default SecretSauce
