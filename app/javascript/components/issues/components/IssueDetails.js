import 'babel-polyfill'
import React, { Component } from 'react'
import Avatar from '../../utils/Avatar'
import IssueHeader from './IssueHeader'
import { formatDate, formatTime } from '../../utils/DateHelper'

import Comments from './Comments'

import getIssue from '../actions/getIssue'


class IssueDetails extends Component {

  constructor(props) {
    super(props)
    this.state = this.resetState()
  }

  componentDidMount() {
    console.log('...IssueDetails onComponentDidMount')
    this.loadIssue()
  }

  async loadIssue() {
    const { data } = await getIssue(this.props.issueId)
    const attr = data.data.attributes
    // let locations = []

    // if (attr.task) {
    //   locations = await loadLocations(this.props.batchId, attr.task.id)
    // }

    this.setState({
      ...this.resetState(),
      id: this.props.issueId,
      title: attr.title,
      description: attr.description,
      severity: attr.severity,
      task_id: attr.task ? attr.task.id : '',
      // locations,
      location_id: attr.location_id,
      location_type: attr.location_type,
      assigned_to_id: attr.assigned_to ? attr.assigned_to.id : '',
      status: attr.status,
      created_at: attr.created_at,
      reported_by: attr.reported_by,
      issue_no: attr.issue_no,
      attachments: attr.attachments
    })
  }

  resetState() {
    return ({
      expanded: false,
      issue_no: '',
      title: '',
      description: '',
      severity: '',
      status: '',
      issue_type: '', 
      location_id: '',
      location_type: '',
      attachments: [],
      comments: [],
      task: null,
      followed_by: [],
      cultivation_batch: [], // maybe not needed
      reported_by: { first_name: '', last_name: '', photo: ''},
      assigned_to: { first_name: '', last_name: '', photo: ''},
      showMore: false,
    })
  }

  toggleEdit = event => {
    this.props.onToggleMode()
    event.preventDefault()
  }

  onToggleShowMore = event => {
    this.setState({ showMore: !this.state.showMore })
    event.preventDefault()
  }

  renderShowMore() {
    if (!this.state.showMore) {
      return (
        <React.Fragment>
          <div className="flex">
            {/* Attachment Placeholder */}
            <div
              className="mr2"
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#bbbbbb',
                borderRadius: '3px'
              }}
            />
            <div
              className="mr2"
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#bbbbbb',
                borderRadius: '3px'
              }}
            />
            <div
              className="mr2"
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#bbbbbb',
                borderRadius: '3px'
              }}
            />
            {/* Attachment Placeholder End */}
          </div>
        
          <div className="flex mt3 mb3">
            <a href="#" className="orange f6 link mt3" onClick={this.onToggleShowMore}>
              Show more
            </a>
          </div>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
         <div className="flex">
          {/* Attachment Placeholder */}
          <div
            className="mr2"
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#bbbbbb',
              borderRadius: '3px'
            }}
          />
          <div
            className="mr2"
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#bbbbbb',
              borderRadius: '3px'
            }}
          />
          <div
            className="mr2"
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#bbbbbb',
              borderRadius: '3px'
            }}
          />
          {/* Attachment Placeholder End */}
        </div>
        <div className="flex mt3 mb3 w-100 justify-end">
          <a href="#" className="link flex items-center outline-0">
            <span className="f7 gray mr2">Followed by</span>
            <Avatar
              firstName=""
              lastName=""
              photoUrl=""
              size={25}
            />
          </a>
        </div>
        <div className="flex mt3 mb3 w-100 items-center justify-between">
          <a href="#" onClick={this.onToggleShowMore} className="orange f6 fw4 link">Show less</a>
          <div>
            <a href="#" onClick={this.toggleEdit} className="btn--secondary link f6 pv2 ph3 br2 mr2">
              Edit
            </a>
            <a href="#" className="btn--secondary link f6 pv2 ph3 br2">
              Archive this issue
            </a>
          </div>
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        <IssueHeader 
          reporterFirsName={this.state.reported_by.first_name} 
          reporterLastName={this.state.reported_by.last_name} 
          reporterPhotoUrl={this.state.reported_by.photo}
          issueNo={this.state.issue_no}
          severity={this.state.severity}
          createdAt={this.state.created_at}
          onClose={this.props.onClose}
        />

        <div className="ph3" style={{ marginTop: '-14px', marginBottom: '-3px' }}>
          <div
            style={{
              borderLeft: '2px solid #e8e8e8',
              height: '25px',
              marginLeft: '11px'
            }}
          />
        </div>

        <div className="ph3">
          <div className="flex w-100">
            <div className="w-auto pv2 mr2">
              <Avatar firstName="Michael" lastName="Doe" size={25} />
            </div>
            <div className="flex flex-column w-100">
              <div className="f6 b dark-grey w-auto pv2 mt1">
                { this.state.title }
              </div>
              <p className="fw4 f6 pre mt0 grey">
                { this.state.description}
              </p>
              { this.renderShowMore() }
            </div>
          </div>
        </div>
        <hr className="w-100" />
        <Comments />
      </React.Fragment>
    )
  }
}

export default IssueDetails
