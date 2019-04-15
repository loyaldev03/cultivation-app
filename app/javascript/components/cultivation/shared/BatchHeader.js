import 'babel-polyfill'
import React from 'react'
import {
  formatDate2,
  ActiveBadge,
  moneyFormatter,
  decimalFormatter,
  sanitizeText
} from '../../utils'

import InlineEditBatchNameField from './InlineEditBatchNameField'
import BatchStore from '../batches/BatchStore'

class BatchHeader extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.name
    }
  }

  updateBatchName = (name, id) => {
    this.setState({ name: name }, () => {
      BatchStore.updateBatchName(name, id)
    })
  }

  render() {
    const {
      batch_no,
      batch_source,
      quantity,
      status,
      id,
      strain,
      grow_method,
      start_date,
      total_estimated_cost,
      total_estimated_hour,
      estimated_harvest_date,
      current_growth_stage,
      actual_hours,
      actual_cost
    } = this.props
    const { name } = this.state
    const batchQuantity = quantity ? quantity : 0
    return (
      <React.Fragment>
        <div className="flex flex-column justify-between bg-white box--shadow">
          <div className="ph4 pb4 pt3">
            <div className="fl w-100 flex justify-center">
              <ActiveBadge className="fr" status={status} />
            </div>
            <div className="fl w-100 flex flex-column">
              <div className="flex justify-between items-center">
                <div className="w-30">
                  <h4 className="tl pa0 ma0 h6--font dark-grey">
                    Batch {batch_no}
                  </h4>
                </div>
                <span className="f5 fr">{current_growth_stage}</span>
              </div>
              <div className="mb3 flex">
                <div className="w-30">
                  <hr />
                  <div className=" flex">
                    <div className="w-40">
                      <label>Batch Source</label>
                    </div>
                    <div className="w-40">
                      <div className="ttc">
                        <label>{sanitizeText(batch_source)}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  {batchQuantity > 0 ? (
                    <div className="flex">
                      <div className="w-40">
                        <label>Batch Name</label>
                      </div>
                      <div className="w-40">
                        <div className="">
                          <InlineEditBatchNameField
                            text={name}
                            indent={0}
                            onDoneClick={value => {
                              this.updateBatchName(value, id)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex">
                      <div className="w-40">Missing Quantity</div>
                      <div className="w-40">
                        <a
                          href={`/cultivation/batches/${id}?select_location=1`}
                          className="link red"
                        >
                          Set location &amp; quantity
                        </a>
                      </div>
                    </div>
                  )}
                  <hr />
                  <div className=" flex">
                    <div className="w-40">
                      <label>Strain</label>
                    </div>
                    <div className="w-40">
                      <div className="">
                        <label>{strain}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-40">
                      <label>Grow Method</label>
                    </div>
                    <div className="w-40">
                      <div className="ttc">
                        <label>{sanitizeText(grow_method)}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>

                <div className="w-30 ml5">
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Start Date </label>
                    </div>
                    <div className="w-50">
                      <div className="tr">
                        <label>{formatDate2(start_date)}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Estimation Cost</label>
                    </div>
                    <div className="w-50">
                      <div className="tr">
                        <label>
                          {moneyFormatter.format(total_estimated_cost)}
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Estimation Hours</label>
                    </div>
                    <div className="w-50">
                      <div className="tr">
                        <label>
                          {decimalFormatter.format(total_estimated_hour)}
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>

                <div className="w-30 ml5">
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Estimated Harvest Date </label>
                    </div>
                    <div className="w-50">
                      <div className="tr">
                        <label>{formatDate2(estimated_harvest_date)}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Actual Cost</label>
                    </div>
                    <div className="w-50">
                      <div className="tr">
                        <label>${actual_cost}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Actual Hour</label>
                    </div>
                    <div className="w-50">
                      <div className="tr">
                        <label>{actual_hours}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default BatchHeader
