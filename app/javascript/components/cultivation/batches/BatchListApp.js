import 'babel-polyfill'
import React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { ActiveBadge, formatDate2 } from '../../utils'
import store from './BatchStore'
import BatchListTable from './BatchListTable'

@observer
class BatchListApp extends React.Component {
  state = {
    tabIndex: 0
  }
  // onSelectTab = () => {
  //   console.log('Clicked Tab')
  // }
  componentDidMount() {
    store.loadBatches()
  }
  render() {
    return (
      <React.Fragment>
        <div className="pa4 fl w-100">
          <div className="bg-white box--shadow pa4 fl w-100">
            <div className="fl w-100 mb4">
              <h5 className="tl pa0 ma0 h5--font dark-grey ttc">Batches</h5>
            </div>
            {store.isLoading ? (
              <div className="grey">Loading...</div>
            ) : (
              store.isDataLoaded && <BatchListTable batches={store.batches} />
            )}
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
