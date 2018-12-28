import React from 'react'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { formatDate2 } from '../../utils'
import BatchHeader from '../shared/BatchHeader'
import BatchTabs from '../shared/BatchTabs'
import ReactTable from 'react-table'

const columns = [
  {
    Header: 'ID',
    accessor: 'attributes.plant_id',
    headerStyle: { textAlign: 'left' },
    width: 100
  },
  {
    Header: 'Type',
    accessor: 'attributes.cultivation_batch',
    headerStyle: { textAlign: 'left' },
    width: 150
  },
  {
    Header: 'Severity',
    accessor: 'attributes.strain_name',
    headerStyle: { textAlign: 'left' },
    width: 100
  },
  {
    Header: 'Title',
    accessor: 'attributes.planting_date',
    headerStyle: { textAlign: 'left' }
  },
  {
    Header: 'Reported',
    accessor: 'attributes.location_name',
    headerStyle: { textAlign: 'left' },
    width: 100
  },
  {
    Header: 'Assigned',
    accessor: 'attributes.location_name',
    headerStyle: { textAlign: 'left' },
    width: 100
  },
  {
    Header: 'Resolution',
    accessor: 'attributes.location_name',
    headerStyle: { textAlign: 'left' },
    width: 150
  }
]

function openSidebar(event, id) {
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

class BatchIssues extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: props.batch
    }
  }

  renderContent() {
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3 ">
          <div className="flex mb3 justify-end">
            <button className="btn btn--primary" onClick={this.openSidebar}>
              Submit an issue
            </button>
          </div>

          <div className="flex">
            <ReactTable
              columns={columns}
              pagination={{ position: 'top' }}
              data={[]}
              showPagination={false}
              pageSize={30}
              minRows={5}
              filterable
              className="f6 w-100"
              showPagination={false}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        <BatchHeader batch={this.props.batch} />
        <BatchTabs batch={this.props.batch} currentTab="issues" />

        {this.renderContent()}

        <div id="toast" className="toast animated toast--success">
          Row Saved
        </div>
      </React.Fragment>
    )
  }
}

export default BatchIssues
