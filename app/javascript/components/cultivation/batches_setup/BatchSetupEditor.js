import React from 'react'
import Select from 'react-select'
import { formatDate } from './../../utils'

const ValidationMessage = ({ enable, show, text }) => {
  if (enable && show) {
    return <span className="red f7 absolute">{text}</span>
  } else {
    return null
  }
}

class BatchSetupEditor extends React.PureComponent {
  render() {
    const {
      startDate,
      batchStrain,
      plantSources,
      growMethods,
      batchSchedule,
      maxCapacity,
      onChange,
      onClose,
      onSave,
      isLoading,
      errors,
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
            <div className="mt2 mb1">
              <span className="subtitle-2 grey db">Strain:</span>
              <span className="subtitle-2 dark-grey">{batchStrain}</span>
            </div>
            <div className="mt2 mb1">
              <span className="subtitle-2 grey db">Planned Start Date:</span>
              <span className="subtitle-2 dark-grey">
                {formatDate(startDate)}
              </span>
            </div>
            <div className="mt2 mb1">
              <label className="subtitle-2 grey db mb1">Schedules:</label>
              <table className="f6 w-100 mw8 center">
                <thead>
                  <tr>
                    <th className="fw6 bb b--black-20 tl pb2 pr3 bg-white dark-grey">
                      Phase
                    </th>
                    <th className="fw6 bb b--black-20 tl pb2 pr3 bg-white dark-grey">
                      Duration &amp; Start Dates
                    </th>
                    <th className="fw6 bb b--black-20 tl pb2 bg-white tr dark-grey w-20">
                      Capacity Available
                    </th>
                  </tr>
                </thead>
                <tbody className="lh-copy">
                  {batchSchedule &&
                    batchSchedule.map(x => (
                      <tr key={x.phase}>
                        <td className="pv1 bb b--black-10 f5 ttc grey">
                          {x.phase}
                        </td>
                        <td className="pv1 bb b--black-10">
                          <span className="flex justify-around">
                            <span className="grey w-20 tr">
                              {x.duration} days
                            </span>
                            <span className="grey">
                              {formatDate(x.startDate)}
                            </span>
                            <span className="grey">-</span>
                            <span className="grey">
                              {formatDate(x.endDate)}
                            </span>
                          </span>
                        </td>
                        <td
                          className="pv1 bb b--black-10 tr grey fw6"
                          title={`Total Capacity:${x.totalCapacity}
Planned Capacity: ${x.planCapacity}
Remaining Capacity: ${x.capacity}`}
                        >
                          {x.capacity}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="mt3 mb1 flex">
              <div className="w-50 pr2">
                <label className="subtitle-2 grey db mb1">Batch Source:</label>
                <Select
                  options={plantSources}
                  className="w-100"
                  onChange={e => onChange('batchSource', e.value)}
                />
                <ValidationMessage
                  text="Select Batch Source"
                  enable={!!(errors && errors.batch_source)}
                  show={!!(errors && errors.batch_source)}
                />
              </div>
              <div className="w-50 pl2">
                <label className="subtitle-2 grey db mb1">Grow Method:</label>
                <Select
                  options={growMethods}
                  className="w-100"
                  onChange={e => onChange('batchGrowMethod', e.value)}
                />
                <ValidationMessage
                  text="Select Grow Method"
                  enable={!!(errors && errors.grow_method)}
                  show={!!(errors && errors.grow_method)}
                />
              </div>
            </div>
            <div className="mt3 mb1">
              <label className="subtitle-2 grey db mb1">Quantity:</label>
              <input
                type="number"
                className="w-50 tr pa2 f6 black ba b--black-20 br2 outline-0"
                defaultValue={0}
                min={1}
                max={maxCapacity}
                onChange={e => onChange('batchQuantity', e.value)}
              />
              <span className="grey ph2">(Maximum: {maxCapacity})</span>
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
