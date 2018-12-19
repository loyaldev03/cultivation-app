import 'babel-polyfill'
import React from 'react'
import classNames from 'classnames'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { ActiveBadge, formatDate2 } from '../../utils'

class BatchListApp extends React.Component {
  state = {
    tabIndex: 0
  }
  onSelectTab = () => {
    console.log('Clicked Tab')
  }
  render() {
    const { batches } = this.props
    return (
      <React.Fragment>
        <div className="pa4 fl w-100">
          <div className="bg-white box--shadow pa4 fl w-100">
            <div className="fl w-100 mb4">
              <h5 className="tl pa0 ma0 h5--font dark-grey ttc">Batches</h5>
            </div>
            <table className="ba br2 b--black-10 pv2 ph3 f6">
              <tbody>
                <tr>
                  <th className="w1" />
                  <th className="w5 pv2 ph3 tl ttu">Batch ID</th>
                  <th className="w4 tr ph3 ttu">Start Date</th>
                  <th className="w4 tr ph3 ttu">Harvest Date</th>
                  <th className="w4 tr ph3 ttu">Active</th>
                  <th />
                </tr>
                {batches.map(b => (
                  <tr className="dim" key={b.batch_no}>
                    <td className="tr">
                      <span className="blue pointer">❗</span>
                    </td>
                    <td className="pv2 ph3 tl ttu">
                      <a
                        className="link"
                        href="/cultivation/batches/5c19b0128c24bd120c671d69"
                      >
                        {b.batch_no}
                      </a>
                    </td>
                    <td className="tr pv2 ph3">
                      {formatDate2(b.start_date)}
                    </td>
                    <td className="tr pv2 ph3">
                      {formatDate2(b.estimated_harvest_date)}
                    </td>
                    <td className="tr pv2 ph3">
                      <ActiveBadge isActive={b.is_active} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <Tabs
              className="react-tabs--primary"
              selectedIndex={this.state.tabIndex}
              onSelect={this.onSelectTab}
            >
              <TabList>
                <Tab key="activeBatches">Active</Tab>
              </TabList>
              <TabPanel key="activeBatches" className="pb4">
                
              </TabPanel>
            </Tabs> */}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default BatchListApp
