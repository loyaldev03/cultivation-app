import React from 'react'
import { observer } from 'mobx-react'
import { formatDate2 } from '../../utils'
import BatchHeader from '../shared/BatchHeader'
import BatchTabs from '../shared/BatchTabs'
import ReactTable from 'react-table'
import IssueSidebar from '../../issues/IssueSidebar'
import loadBatchIssues from '../../issues/actions/loadBatchIssues'
import issueStore from '../../issues/store/IssueStore'

const renderUser = user => {
  if (user) {
    return (
      <div className="tl grey">
        {user.display_name}
      </div>
    )
  } return null
}

const renderHumanize = value => {
  return (
    <div className="tl ttc grey">
      {value.replace(/[_]/g, ' ')}
    </div>
  )
}

const renderSeverity = value => {
  if (value === 'high') {
    return (
      <div className="tc ttc">
        <i className="material-icons red" style={{fontSize: '18px' }}>error</i>
      </div>
    )
  } else if (value === 'medium') {
    return (
      <div className="tc ttc">
        <i className="material-icons gold" style={{fontSize: '18px' }}>warning</i>
      </div>
    )
  } else {
    return (
      <div className="tc ttc">
        <span className="f6 fw4 purple">FYI</span>
      </div>
    )
  }
}

const renderOpenIssue = record => {
  return (
    <a href="#" className="link flex w-100 grey" onClick={event => openSidebar(event, record.original.id)}>
      {record.original.attributes.issue_no}
    </a>
  )
}

const columns = [
  {
    Header: 'ID',
    accessor: 'attributes.issue_no',
    headerStyle: { textAlign: 'left' },
    width: 100,
    Cell: record => renderOpenIssue(record)
  },
  {
    Header: 'Type',
    headerStyle: { textAlign: 'left' },
    width: 150,
    Cell: record => renderHumanize(record.original.attributes.issue_type)
  },
  {
    Header: 'Severity',
    headerStyle: { textAlign: 'center' },
    width: 70,
    Cell: record => renderSeverity(record.original.attributes.severity)
  },
  {
    Header: 'Title',
    accessor: 'attributes.title',
    headerStyle: { textAlign: 'left' }
  },
  {
    Header: 'Reported',
    headerStyle: { textAlign: 'left' },
    width: 100,
    Cell: record => renderUser(record.original.attributes.reported_by)
  },
  {
    Header: 'Assigned',
    headerStyle: { textAlign: 'left' },
    width: 100,
    Cell: record => renderUser(record.original.attributes.assigned_to)
  },
  {
    Header: 'Status',
    headerStyle: { textAlign: 'left' },
    width: 150,
    Cell: record => renderHumanize(record.original.attributes.status)
  }
]

const openSidebar = (event, id = null) => {
  console.log(event)
  console.log(id)
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

@observer
class BatchIssues extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: props.batch
    }
  }

  componentDidMount() {
    window.editorSidebar.setup(document.querySelector('[data-role=sidebar]'))
    loadBatchIssues(this.props.batch_id)
  }

  renderContent() {
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3 ">
          <div className="flex mb3 justify-end">
            <button className="btn btn--primary" onClick={openSidebar}>
              Submit an issue
            </button>
          </div>

          <div className="flex">
            <ReactTable
              columns={columns}
              pagination={{ position: 'top' }}
              data={issueStore.bindable}
              showPagination={false}
              pageSize={30}
              minRows={5}
              filterable
              className="f6 w-100 grey"
            />
            <IssueSidebar />
          </div>
        </div>
      </React.Fragment>
    )
  }

  renderDummySidebar() {
    return (
      <div className="rc-slide-panel" data-role="sidebar">
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">dummy sidebar</h1>
            <span
              className="rc-slide-panel__close-button dim"
              onClick={() => {
                window.editorSidebar.close()
              }}
            >
              <i className="material-icons mid-gray md-18">close</i>
            </span>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <BatchHeader batch={this.props.batch} />
        <BatchTabs batch={this.props.batch} currentTab="issues" />

        {this.renderContent()}
        {this.renderDummySidebar()}

        <div id="toast" className="toast animated toast--success">
          Row Saved
        </div>
      </React.Fragment>
    )
  }
}

export default BatchIssues
