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
  componentDidMount() {
    store.loadBatches()
  }
  onDelete = batchId => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      store.deleteBatch(batchId)
    }
  }
  render() {
    const { defaultFacilityId } = this.props
    return (
      <React.Fragment>
        <div className="pa4 fl w-100">
          <div className="bg-white box--shadow pa4 fl w-100">
            <h5 className="tl pa0 ma0 h5--font dark-grey ttc">Batches</h5>
            {store.isLoading ? (
              <div className="grey">Loading...</div>
            ) : (
              store.isDataLoaded && (
                <BatchListTable
                  batches={store.batches}
                  onDelete={this.onDelete}
                />
              )
            )}
            <a
              href={`/cultivation/batches/new?facility_id=${defaultFacilityId}`}
              className="btn btn--primary"
            >
              Create new batch
            </a>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default BatchListApp
