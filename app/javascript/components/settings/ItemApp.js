import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import { toast } from '../utils/toast'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

@observer
class ItemApp extends React.Component {
  state = {
    tabIndex: 0
  }

  componentDidMount() {}

  onSelectTab = tabIndex => {
    this.setState({ tabIndex })
  }

  render() {
    const { tabIndex } = this.state
    return (
      <React.Fragment>
        <div id="toast" className="toast" />
        <div className="pa4">
          <div className="bg-white box--shadow pa4 fl w-100">
            <div className="fl w-80-l w-100-m">
              <h5 className="tl pa0 ma0 h5--font dark-grey ttc">
                Product Setup
              </h5>
              <p className="mt2 mb4 db body-1 grey">
                Manage your facility's product category &amp; items
              </p>
            </div>
            <div className="fl w-80-l w-100-m">
              <Tabs
                className="react-tabs--primary react-tabs--boxed-panel"
                selectedIndex={tabIndex}
                onSelect={this.onSelectTab}
              >
                <TabList>
                  <Tab>Items</Tab>
                  <Tab>Item Categories</Tab>
                </TabList>
                <TabPanel>
                </TabPanel>
                <TabPanel>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
        <div data-role="sidebar" className="rc-slide-panel">
          <div className="rc-slide-panel__body h-100" />
        </div>
      </React.Fragment>
    )
  }
}

export default ItemApp
