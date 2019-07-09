import React from 'react'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'

@observer
export default class OverallInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedBatch: this.props.batches[0]
    }
  }

  onChangeWorkerCapacityBatch = batch => {
    this.setState({ selectedBatch: batch })
    ChartStore.loadWorkerCapacity(batch.id)
  }

  render() {
    return (
      <React.Fragment>
        <div className="ba b--light-gray pa3 bg-white br2">
          <div className="flex justify-between">
            <div>
              <h1 className="f5 fw6 ml4">Overall Info</h1>
            </div>
            <div className="flex ba b--light-silver br2 pointer dim">
              <h1 className="f6 fw6 ml2 grey">This Month</h1>
              <i className="material-icons grey mr2  md-21 mt2">
                keyboard_arrow_down
              </i>
            </div>
          </div>

          <div className="flex justify-between mt2">
            <div className="flex" style={{ flex: ' 1 1 auto' }}>
              <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                check_circle
              </i>
              <div>
                <h1 className="f5 fw6 grey">Total plants</h1>
                <b className="f3 fw6">1,532</b>
              </div>
            </div>
            <div className="flex" style={{ flex: ' 1 1 auto' }}>
              <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                location_on
              </i>
              <div>
                <h1 className="f5 fw6 grey">Total yield</h1>
                <b className="f3 fw6">5,990lb</b>
              </div>
            </div>
            <div className="flex" style={{ flex: ' 1 1 auto' }}>
              <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                assignment
              </i>
              <div>
                <h1 className="f5 fw6 grey">Projected yield</h1>
                <b className="f3 fw6">1,000lb</b>
              </div>
            </div>
            <div className="flex" style={{ flex: ' 1 1 auto' }}>
              <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                assignment_turned_in
              </i>
              <div>
                <h1 className="f5 fw6 grey">Active batches cost to date</h1>
                <b className="f3 fw6">$10,042</b>
              </div>
            </div>
            <div className="flex" style={{ flex: ' 1 1 auto' }}>
              <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                home
              </i>
              <div>
                <h1 className="f5 fw6 grey">Facility capacity</h1>
                <b className="f3 fw6">74%</b>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
