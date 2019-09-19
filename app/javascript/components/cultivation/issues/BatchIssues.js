import React from 'react'
import Tippy from '@tippy.js/react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Avatar from '../../utils/Avatar'
import BatchHeader from '../shared/BatchHeader'
import BatchTabs from '../shared/BatchTabs'
import ReactTable from 'react-table'
import IssueSidebar from '../../issues/IssueSidebar2'
import loadBatchIssues from '../../issues/actions/loadBatchIssues'
import issueStore from '../../issues/store/IssueStore'
import loadUnresolvedIssueCount from '../../issues/actions/loadUnresolvedIssueCount'
import { SlidePanel } from '../../utils'
import getIssue from '../../issues/actions/getIssue'
import currentIssueStore from '../../issues/store/CurrentIssueStore'

const MenuButton = ({ icon, text, onClick, className = '' }) => {
  return (
    <a
      className={`pa2 flex link dim pointer center ${className}`}
      onClick={onClick}
    >
      <i className="material-icons orange md-24 pr2">{icon}</i>
    </a>
  )
}

@observer
class BatchIssues extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: props.batch,
      unresolvedIssueCount: 0,
      issueSelected: '',
      showIssues: false
    }

    loadBatchIssues(props.batch.id)
  }

  onCloseSidebar = () => {
    this.setState({ showIssues: false })
  }

  openSidebar = (event, id = null, mode = null) => {
    this.setState({
      issueSelected: id,
      showIssues: true
    })

    currentIssueStore.reset()
    currentIssueStore.mode = mode

    if (id) {
      getIssue(id)
    }

    event.preventDefault()
  }

  renderContent() {
    const { showIssues } = this.state

    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3 ">
          <div className="flex mb3 justify-end">
            {this.props.batchPermission.create && (
              <React.Fragment>
                <button
                  className="btn btn--primary"
                  onClick={event => this.openSidebar(event, null, 'create')}
                >
                  Submit an issue
                </button>
              </React.Fragment>
            )}
          </div>

          <div className="flex">
            <ReactTable
              columns={this.columns}
              pagination={{ position: 'top' }}
              data={issueStore.bindable}
              showPagination={false}
              pageSize={30}
              minRows={5}
              filterable
              className="f6 w-100 -highlight"
              getTrProps={(state, rowInfo, column) => {
                let className = 'task-row'
                if (
                  rowInfo &&
                  rowInfo.row &&
                  this.state.issueSelected &&
                  this.state.issueSelected === rowInfo.row.id
                ) {
                  className = 'task-row shadow-1'
                }
                return {
                  className
                }
              }}
            />
            <SlidePanel
              width="500px"
              show={showIssues}
              renderBody={props => (
                <IssueSidebar
                  batch_id={this.props.batch.id}
                  facility_id={this.props.batch.facility_id}
                  mode={currentIssueStore.mode}
                  current_user_first_name={this.props.current_user_first_name}
                  current_user_last_name={this.props.current_user_last_name}
                  current_user_photo={this.props.current_user_photo}
                  onClose={this.onCloseSidebar}
                  canUpdate={this.props.batchPermission.update}
                />
              )}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }

  renderUser = user => {
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

  renderHumanize = value => {
    return <div className="tl ttc grey">{value.replace(/[_]/g, ' ')}</div>
  }

  renderSeverity = value => {
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

  renderOpenIssue = record => {
    return (
      <a
        href="#"
        className="link flex w-100 grey"
        onClick={event =>
          this.openSidebar(event, record.original.id, 'details')
        }
      >
        {record.original.attributes.issue_no.toString().padStart(5, '0')}
      </a>
    )
  }

  renderTitle = record => {
    let tags = record.original.attributes.tags || []
    return (
      <div className="flex justify-between w-100">
        <a
          href="#"
          className="link flex w-100 grey"
          onClick={event =>
            this.openSidebar(event, record.original.id, 'details')
          }
        >
          {record.original.attributes.title}
        </a>
        {tags.length > 0 &&
          tags.map((tag, index) => (
            <span className="bg-green ba white f7 fw4 ph1 br2 ml1" key={index}>
              {tag}
            </span>
          ))}
      </div>
    )
  }

  deleteIssue = e => {
    if (confirm('Are you sure?')) {
      issueStore.deleteIssue(e, this.props.batch.id)
    }
  }

  actionIssue = data => {
    const { id } = data.row
    const canDelete= this.props.batchPermission.delete
    return (
      <div className="flex flex-auto justify-between items-center h-100 hide-child">
        {canDelete ? (
        <MenuButton
          icon="delete"
          text="Delete Issue"
          onClick={e => this.deleteIssue(id)}
        />
      ) : null}
      </div>
    )
  }

  columns = [
    {
      Header: 'ID',
      accessor: 'id',
      headerStyle: { textAlign: 'left' },
      width: 100,
      Cell: record => this.renderOpenIssue(record)
    },
    {
      Header: 'Type',
      headerStyle: { textAlign: 'left' },
      width: 150,
      Cell: record => this.renderHumanize(record.original.attributes.issue_type)
    },
    {
      Header: 'Severity',
      headerStyle: { textAlign: 'center' },
      width: 70,
      Cell: record => this.renderSeverity(record.original.attributes.severity)
    },
    {
      Header: 'Title',
      accessor: 'attributes.title',
      headerStyle: { textAlign: 'left' },
      Cell: record => this.renderTitle(record)
    },
    {
      Header: 'Reported',
      headerStyle: { textAlign: 'center' },
      width: 90,
      Cell: record => this.renderUser(record.original.attributes.reported_by)
    },
    {
      Header: 'Assigned',
      headerStyle: { textAlign: 'center' },
      width: 90,
      Cell: record => this.renderUser(record.original.attributes.assigned_to)
    },
    {
      Header: 'Status',
      headerStyle: { textAlign: 'left' },
      width: 100,
      Cell: record => this.renderHumanize(record.original.attributes.status)
    },
    {
      Header: 'Action',
      headerStyle: { textAlign: 'center' },
      width: 90,
      Cell: this.actionIssue
    },
  ]

  render() {
    const { batch } = this.props

    return (
      <React.Fragment>
        <BatchHeader {...batch} />
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
