import React from 'react'
import { observer } from 'mobx-react'
import SidebarStore from '../stores/SidebarStore'
import { SlidePanelHeader, toast, SlidePanelFooter } from '../../utils'
import { NumericInput } from '../../utils/FormHelpers'
import harvestBatchStore from '../stores/HarvestBatchStore'

@observer
class WasteWeightForm extends React.Component {
  state = {
    errors: {},
    plantId: '',
    weight: '',
    override: false
  }

  async componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      await harvestBatchStore.load(this.props.batchId)
      this.setState({ weight: harvestBatchStore.totalWetWasteWeight })
    }
  }

  onChangeWeight = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onSubmit = event => {
    const { batchId } = this.props
    const { weight } = this.state
    harvestBatchStore.saveWasteWeight(batchId, weight).then(result => {
      console.log(result)

      if (result.success) {
        toast(`Wet waste weight captured`, 'success')
        this.setState({
          weight: '',
          override: false
        })
        SidebarStore.closeSidebar()
      } else {
        console.log(result.data.errors)
      }
    })
  }

  render() {
    const { show = true } = this.props
    const { weight } = this.state

    const weightLabel = `Waste weight, ${harvestBatchStore.uom}`

    const harvestBatchName = harvestBatchStore.harvestBatchName
    if (!show) return null
    return (
      <div className="flex flex-column h-100">
        <div id="toast" className="toast animated toast--success" />
        <SlidePanelHeader
          onClose={() => SidebarStore.closeSidebar()}
          title="Record waste wet weight"
        />

        <div className="flex flex-column flex-auto justify-between">
          <div className="pa2 flex flex-column">
            <div className="ph4 mt3 flex items-center">
              <span className="f6 fw6">Harvest Batch Name</span>
            </div>
            <div className="ph4 mt2 flex flex-column w-100">
              <span className="f6 fw6 gray">{harvestBatchName}</span>
            </div>

            <div className="flex items-end ph4 mt4">
              <div className="w-30">
                <NumericInput
                  label={weightLabel}
                  labelClassName="ttn"
                  value={weight}
                  placeholder=""
                  min={0}
                  fieldname="weight"
                  onChange={this.onChangeWeight}
                />
              </div>
            </div>
          </div>
          <SlidePanelFooter onSave={() => this.onSubmit()} />
        </div>
      </div>
    )
  }
}

export default WasteWeightForm
