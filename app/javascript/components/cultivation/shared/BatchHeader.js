import React from 'react'
import { formatDate2 } from '../../utils'

const batchHeader = ({ batch }) => {
  return (
    <div className="flex flex-column justify-between bg-white box--shadow">
      <div className="pa4">
        <div className="fl w-100 flex flex-column">
          <div className=" flex">
            <div className="w-40">
              <h4 className="tl pa0 ma0 h6--font dark-grey">
                Batch {batch.batch_no}
              </h4>
            </div>
          </div>
          <div className="mb3 flex grey">
            <div className="w-30">
              <hr />
              <div className="flex">
                <div className="w-40">
                  <label>Batch Source</label>
                </div>
                <div className="w-40">
                  <div className="">
                    <label>{batch.batch_source}</label>
                  </div>
                </div>
              </div>
              <hr />
              <div className=" flex">
                <div className="w-40">
                  <label>Batch Name</label>
                </div>
                <div className="w-40">
                  <div className="">
                    <label>{batch.name}</label>
                  </div>
                </div>
              </div>
              <hr />
              <div className=" flex">
                <div className="w-40">
                  <label>Strain</label>
                </div>
                <div className="w-40">
                  <div className="">
                    <label>{batch.strain}</label>
                  </div>
                </div>
              </div>
              <hr />
              <div className=" flex">
                <div className="w-40">
                  <label>Grow Method</label>
                </div>
                <div className="w-40">
                  <div className="">
                    <label>{batch.grow_method}</label>
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
                  <div className="">
                    <label>{formatDate2(batch.start_date)}</label>
                  </div>
                </div>
              </div>
              <hr />
              <div className=" flex">
                <div className="w-50">
                  <label>Total Estimation Cost</label>
                </div>
                <div className="w-50">
                  <div className="">
                    <label>{batch.total_estimated_cost}</label>
                  </div>
                </div>
              </div>
              <hr />
              <div className=" flex">
                <div className="w-50">
                  <label>Total Estimation Hours</label>
                </div>
                <div className="w-50">
                  <div className="">
                    <label> - </label>
                  </div>
                </div>
              </div>
              <hr />
            </div>

            <div className="w-30 ml5">
              <hr />
              <div className=" flex">
                <div className="w-50">
                  <label>Estimated Harvest Dat </label>
                </div>
                <div className="w-50">
                  <div className="">
                    <label>{formatDate2(batch.start_date)}</label>
                  </div>
                </div>
              </div>
              <hr />
              <div className=" flex">
                <div className="w-50">
                  <label>Total Actual Cost</label>
                </div>
                <div className="w-50">
                  <div className="">
                    <label> - </label>
                  </div>
                </div>
              </div>
              <hr />
              <div className=" flex">
                <div className="w-50">
                  <label>Total Actual Hour</label>
                </div>
                <div className="w-50">
                  <div className="">
                    <label> - </label>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default batchHeader
