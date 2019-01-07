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
      const id = event.detail.id
      const mode = event.detail.mode

      if (mode === 'details') {
        this.setState({ mode })
      } else if (!id) {
        this.setState({ mode: 'edit' })
      } else {
        this.setState({ id, mode: 'create' })
        // Load issue
      }
    })
  }

  resetState() {
    return {
      id: '',
      mode: 'create'
    }
  }

  onClose = () => {
    window.editorSidebar.close()
  }

  renderBody() {

    const { batch } = this.props
    const { mode } = this.state

    if (mode === 'details') {
      return <IssueDetails onClose={this.onClose} batchId={batch.id} />
    } else {
      return <IssueForm
        onClose={this.onClose}
        mode={this.state.mode}
        batch={batch}
      />
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
