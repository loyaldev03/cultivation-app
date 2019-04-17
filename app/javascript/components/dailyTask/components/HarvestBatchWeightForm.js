import React, { useState, forwardRef } from 'react'
import isEmpty from 'lodash.isempty'
import { observer } from 'mobx-react'
import SidebarStore from '../stores/SidebarStore'
// import ClippingStore from '../stores/ClippingStore'
// import PlantTagList from './PlantTagList'
import { InputBarcode, SlidePanelHeader, ProgressBar } from '../../utils'
import dailyTasksStore from '../stores/DailyTasksStore'

@observer
class HarvestBatchWeightForm extends React.Component {
  state = { 
    errors: {} 
  }

  // <React.Fragment>
  //   <SlidePanelHeader
  //     onClose={() => SidebarStore.closeSidebar()}
  //     title="Record wet weight"
  //   />
  //   <div className="flex justify-between ph4 mt3">
  //     <span>Progress</span>
  //     <span>0/100</span>
  //   </div>
  //   <div className="ph4">Scan barcode or enter plant ID</div>

  //   <div className="ph4">Wet weight, g</div>
  // </React.Fragment>
  
  componentDidMount() {
    // call API
    console.log('call api')
  }

  onInputChange = () => {}
  onScanMother = () => {}

  render() {
    const { batchId, scanditLicense, show = true } = this.props
    const { errors } = this.state

    if (!show) return null
    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader
          onClose={() => SidebarStore.closeSidebar()}
          title="Record wet weight"
        />
        <div className="ph4 mt3 mb2 flex justify-between">
          <span className="f6 fw6 gray">Progress</span>
          <span className="f6 gray">0/100</span>
        </div>
        <div className="ph4 mt1 mb3 flex items-center">
          <ProgressBar percent={32.3} height={10} className="w-100" />
        </div>

        <div className="ph4 mt3 flex items-center">
          <span className="f6 fw6 gray">Scan barcode or enter plant ID</span>
        </div>
        <div className="ph4 mt2 flex items-center w-100">
          <InputBarcode
            scanditLicense={scanditLicense}
            autoFocus={true}
            // ref={input => (motherInput = input)}
            onKeyPress={this.onScanMother}
            error={errors['motherInput']}
            className="w-100"
          />
        </div>

        <div className="ph4 mt3 flex items-center">
          <span className="f6 fw6 gray">Scan barcode or enter plant ID</span>
        </div>
        <div className="ph4 mt2 flex items-center w-60">
          <input
            name="waste"
            type="number"
            size="4"
            min="0"
            className="flex flex-auto pa1 ba tr ba b--black-20 br2 outline-0 w-60"
            onChange={this.onInputChange}
          />
          <a href="#" className="bg-orange white btn btn-primary ml2">E</a>
        </div>
      </div>
    )
  }
}


export default HarvestBatchWeightForm
