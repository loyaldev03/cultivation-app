import React from 'react'
import IssueForm from './components/IssueForm.js'

class IssueSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {
      const id = event.detail.id
      if (!id) {
      } else {
        this.setState({ id })
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
    const { batchId } = this.props
    if (this.props.mode === 'details') {
      return (
        // TODO: Show details page
        null
      )
    } else {
      return <IssueForm onClose={this.onClose} mode={this.state.mode} batchId={batchId} />
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
