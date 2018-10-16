import React from 'react'
import Select from 'react-select'
import { formatDate } from './../../utils'

class BatchSetupEditor extends React.PureComponent {
  render() {
    const { date, strains, growMethods, onChange, submit } = this.props
    return (
      <div>
        <div>{formatDate(date)}</div>
        <div></div>
        <div>Strain</div>
        <Select
          options={strains}
          onChange={e => onChange('strain', e.value)}
        />
        <Select
          options={growMethods}
          onChange={e => onChange('grow_method', e.value)}
        />
        <div className="w-100 flex justify-end mt3">
          <a
            className="pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6 pointer"
            onClick={submit}
          >
            Save
          </a>
        </div>
      </div>
    )
  }
}

export default BatchSetupEditor
