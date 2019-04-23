import React from 'react'
import { observer } from 'mobx-react'
import SidebarStore from '../stores/SidebarStore'
import { SlidePanelHeader, toast, SlidePanelFooter } from '../../utils'
import { NumericInput } from '../../utils/FormHelpers'
import harvestBatchStore from '../stores/HarvestBatchStore'

@observer
class WeightForm extends React.Component {
  state = {
    errors: {},
    plantId: '',
    weight: '',
    override: false
  }

  async componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      const taskIndelible = SidebarStore.taskIndelible
      await harvestBatchStore.load(this.props.batchId)
      let weight = 0
      if (taskIndelible === 'measure_waste_weight') {
        weight = harvestBatchStore.totalWetWasteWeight
      } else if (taskIndelible === 'measure_dry_weight') {
        weight = harvestBatchStore.totalDryWeight
      } else if (taskIndelible === 'measure_trim_weight') {
        weight = harvestBatchStore.totalTrimWeight
      } else if (taskIndelible === 'measure_trim_waste') {
        weight = harvestBatchStore.totalTrimWasteWeight
      }
      this.setState({ weight: weight })
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
    const indelible = SidebarStore.taskIndelible
    harvestBatchStore.saveWasteWeight(batchId, weight, indelible).then(result => {
      if (result.success) {
        toast(`Record updated`, 'success')
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

  getLabel = (taskIndelible) => {
    if (taskIndelible === 'measure_waste_weight'){
      return 'Wet Waste weight'
    } else if (taskIndelible === 'measure_dry_weight'){
      return 'Dry weight'
    } else if (taskIndelible === 'measure_trim_weight') {
      return 'Trim weight'
    } else if (taskIndelible === 'measure_trim_waste') {
      return 'Trim Waste weight'
    }
  }

  getHeader = (taskIndelible) => {
    if (taskIndelible === 'measure_waste_weight') {
      return 'Record wet waste weight'
    } else if (taskIndelible === 'measure_dry_weight') {
      return 'Record dry weight'
    } else if (taskIndelible === 'measure_trim_weight') {
      return 'Record trim weight'
    } else if (taskIndelible === 'measure_trim_waste') {
      return 'Record trim waste weight'
    }
  }

  render() {
    const { show = true } = this.props
    const { weight } = this.state
    const taskIndelible = SidebarStore.taskIndelible

    const weightLabel = `${this.getLabel(taskIndelible)}, ${harvestBatchStore.uom}`
    const headerLabel = this.getHeader(taskIndelible)

    const harvestBatchName = harvestBatchStore.harvestBatchName
    if (!show) return null
    return (
      <div className="flex flex-column h-100">
        <div id="toast" className="toast animated toast--success" />
        <SlidePanelHeader
          onClose={() => SidebarStore.closeSidebar()}
          title={headerLabel}
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

export default WeightForm
