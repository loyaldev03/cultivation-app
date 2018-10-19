import React from 'react'
import Select from 'react-select'
import { formatDate } from './../../utils'

class BatchSetupEditor extends React.PureComponent {
  render() {
    const {
      startDate,
      strains,
      batchStrain,
      growMethods,
      onChange,
      onClose,
      onSave,
      isLoading
    } = this.props

    const saveButtonText = isLoading ? 'Saving...' : 'Save and Continue'

    return (
      <div className="h-100 flex flex-column">
        <div className="ph4 pv3 bb b--light-grey">
          <h5 className="h6--font dark-grey ma0">Batch &amp; Details</h5>
          <a
            href="#0"
            className="slide-panel__close-button dim"
            onClick={onClose}
          >
            <i className="material-icons mid-gray md-18 pa1">close</i>
          </a>
        </div>
        <form
          className="pv3 h-100 flex-auto flex flex-column justify-between"
          onSubmit={e => {
            e.preventDefault()
            const data = {}
            onSave(data)
          }}
        >
          <div className="ph4">
            <div className="mt2">
              <span className="subtitle-2 grey db mt2 mb1">
                Strain: {batchStrain}
              </span>
            </div>
            <div className="mt2">
              <span className="subtitle-2 grey db mt2 mb1">
                Planned Start Date: {formatDate(startDate)}
              </span>
            </div>
            <div className="mt2">
              <label className="subtitle-2 grey db mb1">Grow Method:</label>
              <Select
                options={growMethods}
                onChange={e => onChange('batchGrowMethod', e.value)}
              />
            </div>
          </div>
          <div className="bt b--light-grey pv3 ph4">
            <input
              type="submit"
              disabled={isLoading}
              value={saveButtonText}
              className="fr ph3 pv2 bg-orange button--font white bn box--br3 ttu link dim pointer"
            />
          </div>
        </form>
      </div>
    )
  }
}

export default BatchSetupEditor
