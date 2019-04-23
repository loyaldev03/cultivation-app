import React from 'react'
import { toJS, autorun } from 'mobx'
import { observer } from 'mobx-react'
import SidebarStore from '../stores/SidebarStore'
import { InputBarcode, SlidePanelHeader, ProgressBar, toast } from '../../utils'
import { NumericInput } from '../../utils/FormHelpers'
import harvestBatchStore from '../stores/HarvestBatchStore'

@observer
class HarvestBatchWeightForm extends React.Component {
  state = {
    errors: {},
    plant_id: '',
    weight: '',
    askOverride: false,
    override: false
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      harvestBatchStore.load(this.props.batchId)
    }

    if (prevProps.show && !this.props.show) {
      this.setState({
        errors: {},
        plant_id: '',
        weight: '',
        askOverride: false,
        override: false
      })
    }
  }

  onChange = event => {
    this.setState({ plant_id: event.target.value })
  }

  onChangeWeight = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onSave = event => {
    if (event) {
      event.preventDefault()
    }

    const { plant_id, weight, isValid } = this.validateAndGetValues()
    if (!isValid) {
      return
    }

    const { batchId } = this.props
    const { override } = this.state
    harvestBatchStore
      .saveWeight(batchId, plant_id, weight, override)
      .then(result => {
        if (result.success) {
          toast(`${plant_id} wet weight captured`, 'success')
          this.setState({
            plant_id: '',
            weight: '',
            override: false,
            askOverride: false,
            errors: {}
          })
        } else {
          if (result.data.errors.duplicate_plant) {
            this.setState({
              askOverride: true
            })
          }

          this.setState({
            errors: result.data.errors,
            override: false
          })
        }
      })
  }

  validateAndGetValues() {
    const { plant_id, weight } = this.state
    let errors = {}

    if (plant_id.length === 0) {
      errors.plant_id = ['Plant ID is required']
    }

    if (weight.length === 0 || parseFloat(weight) <= 0) {
      errors.weight = ['Weight must be more than zero.']
    }

    const isValid = Object.getOwnPropertyNames(errors).length === 0
    if (!isValid) {
      this.setState({ errors })
    }

    return {
      isValid,
      plant_id,
      weight
    }
  }

  onSaveOverride = event => {
    event.preventDefault()
    this.setState({ override: true }, () => {
      this.onSave()
    })
  }

  render() {
    const { batchId, scanditLicense, show = true } = this.props
    const { errors, weight, plant_id } = this.state

    const weightLabel = `Wet weight, ${harvestBatchStore.uom}`
    const percent = Math.round(
      (toJS(harvestBatchStore.totalWeighted) /
        toJS(harvestBatchStore.totalPlants)) *
        100
    )

    if (!show) return null
    return (
      <div className="flex flex-column h-100">
        <div id="toast" className="toast animated toast--success" />
        <SlidePanelHeader
          onClose={() => SidebarStore.closeSidebar()}
          title="Record wet weight"
        />
        <div className="ph4 mt3 mb2 flex justify-between">
          <span className="f6 fw6 gray">Progress</span>
          <span className="f6 gray">
            {harvestBatchStore.totalWeighted}/{harvestBatchStore.totalPlants}
          </span>
        </div>
        <div className="ph4 mt1 mb3 flex items-center">
          <ProgressBar percent={percent} height={10} className="w-100" />
        </div>

        <div className="ph4 mt3 flex items-center">
          <span className="f6 fw6 gray">Scan barcode or enter plant ID</span>
        </div>
        <div className="ph4 mt2 flex flex-column w-100">
          <InputBarcode
            value={plant_id}
            scanditLicense={scanditLicense}
            autoFocus={true}
            onChange={this.onChange}
            onKeyPress={this.onScanMother}
            error={errors['plant_id']}
            className="w-100"
          />
        </div>

        <div className="flex items-end ph4 mb2">
          <div className="w-100">
            <span className="f6 fw6 gray ttn">{weightLabel}</span>
          </div>
        </div>
        <div className="flex items-start ph4">
          <div className="w-30">
            <NumericInput
              value={weight}
              placeholder="Plant wet weight"
              min={0}
              fieldname="weight"
              onChange={this.onChangeWeight}
              errors={errors}
            />
          </div>
          <div className="ml2 w-20">
            <a
              href="#"
              className="bg-orange white btn btn-primary btn--small"
              onClick={this.onSave}
            >
              &#9166;
            </a>
          </div>
        </div>

        {this.state.askOverride && (
          <div className="flex ph4 mt3 justify-between">
            <p className="f6 mr2 mb0 mt2 w-70">
              <span className="fw6">{plant_id}</span> is already recorded.
              Proceed to override?
            </p>
            <span className="w-30 items-center justify-end flex">
              <a
                href="#"
                onClick={this.onSaveOverride}
                className="btn btn--secondary f6 btn--small"
              >
                Yes
              </a>
              <a href="#" className="link f6 fw4 ph3 ttu">
                No
              </a>
            </span>
          </div>
        )}
      </div>
    )
  }
}

export default HarvestBatchWeightForm
