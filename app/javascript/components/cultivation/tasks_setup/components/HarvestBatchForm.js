import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Select from 'react-select'
import { TextInput, NumericInput } from '../../../utils/FormHelpers'
import { SlidePanelHeader, SlidePanelFooter } from '../../../utils'
import reactSelectStyle from '../../../utils/reactSelectStyle'

// @observer
class HarvestBatchForm extends React.Component {

  state = {
    name: '',
    harvest_room: '',
    uom: null,
    errors: {}
  }

  onSave = () => {
    console.log('on save')
  }

  validate = () => {

  }

  handleChangeText = fieldName => e => {
    this.setState({
      [fieldName]: e.target.value
    })
  }

  handleUomChanged = uom => {
    this.setState({ uom })
  }

  render() {
    const { onClose } = this.props
    const { name, harvest_room, errors, uom } = this.state
    const uomOptions = ['g', 'lb'].map(x => ({ label: x, value: x }))
    return (
      <div>
        <SlidePanelHeader onClose={onClose} title="Create Harvest" />
        
          <div className="ph4 mv3 flex">
            <div className="w-100">
              <TextInput
                label={'Harvest batch name'}
                value={name}
                onChange={this.handleChangeText('name')}
                errors={errors}
                errorField="name"
              />
            </div>
          </div>
          <div className="ph4 mv3 flex flex-column">
            <label className="subtitle-2 grey fl pb2">Unit of measure</label>
            <div className="w-100 flex flex-column">
              <Select
                options={uomOptions}
                value={uom}
                onChange={this.handleUomChanged}
                styles={reactSelectStyle}
              />
            </div>
          </div>
          <div className="ph4 mt3 mb4 flex">
            <div className="w-100">
              <TextInput
                label={'Harvest room'}
                value={harvest_room}
                onChange={this.handleChangeText('harvest_room')}
                errors={errors}
                errorField="harvest_room"
              />
            </div>
          </div>
          <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
      </div>
    )
  }
}
export default HarvestBatchForm
