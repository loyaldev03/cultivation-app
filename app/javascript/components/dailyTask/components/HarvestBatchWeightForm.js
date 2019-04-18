import React from 'react'
import { toJS, autorun } from 'mobx'
import { observer } from 'mobx-react'
import SidebarStore from '../stores/SidebarStore'
// import ClippingStore from '../stores/ClippingStore'
// import PlantTagList from './PlantTagList'
import { InputBarcode, SlidePanelHeader, ProgressBar, toast } from '../../utils'
import { NumericInput } from '../../utils/FormHelpers'
import dailyTasksStore from '../stores/DailyTasksStore'
import harvestBatchStore from '../stores/HarvestBatchStore'

@observer
class HarvestBatchWeightForm extends React.Component {
  state = {
    errors: {},
    plantId: '',
    weight: '',
    override: false
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      harvestBatchStore.load(this.props.batchId)
    }
  }

  onChange = event => {
    this.setState({ plantId: event.target.value })
  }

  onChangeWeight = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onSubmit = event => {
    const { batchId } = this.props
    const { plantId, weight } = this.state
    harvestBatchStore.saveWeight(batchId, plantId, weight).then(result => {
      console.log(result)

      if (result.success) {
        toast(`${plantId} wet weight captured`, 'success')
        this.setState({
          plantId: '',
          weight: '',
          override: false
        })
      } else {
        this.setState({
          errors: result.data.errors
        })
      }
    })
    event.preventDefault()
  }

  render() {
    const { batchId, scanditLicense, show = true } = this.props
    const { errors, weight, plantId } = this.state

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
            value={plantId}
            scanditLicense={scanditLicense}
            autoFocus={true}
            onChange={this.onChange}
            onKeyPress={this.onScanMother}
            error={errors['motherInput']}
            className="w-100"
          />
        </div>

        <div className="flex items-end ph4">
          <div className="w-30">
            <NumericInput
              label={weightLabel}
              labelClassName="ttn"
              value={weight}
              placeholder="Plant wet weight"
              min={0}
              fieldname="weight"
              onChange={this.onChangeWeight}
            />
          </div>
          <div className="ml2 w-20">
            <a
              href="#"
              className="bg-orange white btn btn-primary btn--small"
              onClick={this.onSubmit}
            >
              &#9166;
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default HarvestBatchWeightForm
