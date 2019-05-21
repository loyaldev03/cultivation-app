import React from 'react'

export default class DashboardPaymentDetail extends React.Component {
  render() {
    return (
      <div className="flex mt4">
        <div className="w-100">
          <div className="ba b--light-gray pa3 bg-white">
            <div>
              <h1 className="f5 fw6 ">Payment Details</h1>
            </div>
            <table className="f6 w-100 mw8 mt4" cellSpacing="0">
              <thead>
                <tr>
                  <th className="fw6 tl pb3 pr3 bg-white">Bill</th>
                  <th className="fw6 tl pb3 pr3 bg-white">Date</th>
                  <th className="fw6 tl pb3 pr3 bg-white">Salary</th>
                  <th className="fw6 tl pb3 pr3 bg-white">OT Bonus</th>
                </tr>
              </thead>
              <tbody className="lh-copy">
                <tr>
                  <td className="pv3 pr3">Transaction #46256</td>
                  <td className="pv3 pr3">05.03.2019</td>
                  <td className="pv3 pr3 green">$200</td>
                  <td className="pv3 pr3 green">$200</td>
                </tr>
                <tr>
                  <td className="pv3 pr3">Transaction #46256</td>
                  <td className="pv3 pr3">05.03.2019</td>
                  <td className="pv3 pr3 green">$590</td>
                  <td className="pv3 pr3 green">$20.90</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
