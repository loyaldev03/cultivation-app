import React from 'react'
import IssueForm from './components/IssueForm.js'
import IssueDetails from './components/IssueDetails.js'

class IssueSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {
      const issueId = event.detail.id
      const mode = event.detail.mode

      if (mode === 'details') {
        this.setState({ mode, issueId })
      } else if (!issueId) {
        this.setState({ mode: 'create', issueId: '' })
      } else {
        this.setState({ mode: 'edit', issueId })
      }
    })
  }

  resetState() {
    return {
      issueId: '',
      mode: 'create'
    }
  }

  onToggleMode = () => {
    if (this.state.mode === 'details') {
      this.setState({ mode: 'edit' })
    } else {
      this.setState({ mode: 'details' })
    }
  }

  onClose = () => {
    window.editorSidebar.close()
  }

  renderBody() {
    const { batch } = this.props
    const { mode } = this.state

    if (mode === 'details') {
      return (
        <IssueDetails
          onClose={this.onClose}
          onToggleMode={this.onToggleMode}
          issueId={this.state.issueId}
          batchId={batch.id}
        />
      )
    } else {
      return (
        <IssueForm
          onClose={this.onClose}
          onToggleMode={this.onToggleMode}
          mode={this.state.mode}
          issueId={this.state.issueId}
          batchId={batch.id}
          facilityId={batch.facility_id}
        />
      )
    }
  }

  render() {
    return (
      <div className="rc-slide-panel" data-role="sidebar">
        <div className="rc-slide-panel__body flex flex-column">
          {this.renderBody()}
        </div>
      </div>
    )
  }
}

export default IssueSidebar
