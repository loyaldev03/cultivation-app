import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Avatar from '../../utils/Avatar'
import BatchHeader from '../shared/BatchHeader'
import BatchTabs from '../shared/BatchTabs'
import ReactTable from 'react-table'
import IssueSidebar from '../../issues/IssueSidebar'
import loadBatchIssues from '../../issues/actions/loadBatchIssues'
import issueStore from '../../issues/store/IssueStore'
import loadUnresolvedIssueCount from '../../issues/actions/loadUnresolvedIssueCount'

const renderUser = user => {
  if (user) {
    return (
      <div className="flex justify-center">
        <Avatar
          firstName={user.first_name}
          lastName={user.last_name}
          photoUrl={user.photo}
          size={20}
        />
      </div>
    )
  }
  return null
}

const renderHumanize = value => {
  return <div className="tl ttc grey">{value.replace(/[_]/g, ' ')}</div>
}

const renderSeverity = value => {
  if (value === 'high') {
    return (
      <div className="tc ttc">
        <i className="material-icons red" style={{ fontSize: '18px' }}>
          error
        </i>
      </div>
    )
  } else if (value === 'medium') {
    return (
      <div className="tc ttc">
        <i className="material-icons gold" style={{ fontSize: '18px' }}>
          warning
        </i>
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
    <a
      href="#"
      className="link flex w-100 grey"
      onClick={event => openSidebar(event, record.original.id, 'details')}
    >
      {record.original.attributes.issue_no.toString().padStart(5, '0')}
    </a>
  )
}

const columns = [
  {
    Header: 'ID',
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
    headerStyle: { textAlign: 'center' },
    width: 90,
    Cell: record => renderUser(record.original.attributes.reported_by)
  },
  {
    Header: 'Assigned',
    headerStyle: { textAlign: 'center' },
    width: 90,
    Cell: record => renderUser(record.original.attributes.assigned_to)
  },
  {
    Header: 'Status',
    headerStyle: { textAlign: 'left' },
    width: 100,
    Cell: record => renderHumanize(record.original.attributes.status)
  }
]

const openSidebar = (event, id = null, mode = null) => {
  window.editorSidebar.open({ id, mode, width: '500px' })
  event.preventDefault()
}

@observer
class BatchIssues extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: props.batch,
      unresolvedIssueCount: 0
    }
  }

  componentDidMount() {
    window.editorSidebar.setup(document.querySelector('[data-role=sidebar]'))
    loadBatchIssues(this.props.batch.id)
  }

  renderContent() {
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3 ">
          <div className="flex mb3 justify-end">
            <button
              className="btn btn--primary"
              onClick={event => openSidebar(event, null, 'create')}
            >
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
            <IssueSidebar
              batch_id={this.props.batch.id}
              facility_id={this.props.batch.facility_id}
              mode={this.state.mode}
              current_user_first_name={this.props.current_user_first_name}
              current_user_last_name={this.props.current_user_last_name}
              current_user_photo={this.props.current_user_photo}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }

  render() {
    const { batch } = this.props

    return (
      <React.Fragment>
        <BatchHeader
          batch_no={batch.batch_no}
          batch_source={batch.batch_source}
          quantity={batch.quantity}
          status={batch.status}
          name={batch.name}
          id={batch.id}
          strain={batch.strain}
          grow_method={batch.grow_method}
          start_date={batch.start_date}
          total_estimated_cost={batch.total_estimated_cost}
          total_estimated_hour={batch.total_estimated_hour}
          estimated_harvest_date={batch.estimated_harvest_date}
        />
        <BatchTabs
          batch={batch}
          currentTab="issues"
          unresolvedIssueCount={issueStore.unresolvedCount}
        />

        {this.renderContent()}

        <div id="toast" className="toast animated toast--success">
          Row Saved
        </div>
      </React.Fragment>
    )
  }
}

BatchIssues.propTypes = {
  batch: PropTypes.object.isRequired,
  current_user_first_name: PropTypes.string.isRequired,
  current_user_last_name: PropTypes.string.isRequired,
  current_user_photo: PropTypes.string
}

export default BatchIssues
