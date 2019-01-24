import React from 'react'
import {
  formatDate2,
  ActiveBadge,
  moneyFormatter,
  decimalFormatter,
  sanitizeText
} from '../../utils'

class BatchHeader extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      batch_no,
      batch_source,
      quantity,
      status,
      name,
      id,
      strain,
      grow_method,
      start_date,
      total_estimated_cost,
      total_estimated_hour,
      estimated_harvest_date
    } = this.props
    const batchQuantity = quantity ? quantity : 0

    return (
      <React.Fragment>
        <div className="flex flex-column justify-between bg-white box--shadow">
          <div className="pa4">
            <div className="fl w-100 flex flex-column">
              <div className="flex">
                <div className="w-30">
                  <h4 className="tl pa0 ma0 h6--font dark-grey">
                    Batch {batch_no}
                    <ActiveBadge className="fr" status={status} />
                  </h4>
                </div>
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
                          <label>{name}</label>
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
                        <label>--</label>
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
                        <label>--</label>
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
