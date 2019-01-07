import React from 'react'
import classNames from 'classnames'

export default class InlineEditTextField extends React.PureComponent {
  state = {
    isEdit: false
  }
  switchEditMode = e => {
    this.setState({ isEdit: true })
    if (this.props.onHighlight) {
      this.props.onHighlight()
    }
  }
  switchViewMode = e => {
    const { onDoneClick, text } = this.props
    this.setState({ isEdit: false })
    const { value } = this.textInput
    if (onDoneClick && text !== value) {
      onDoneClick(value)
    }
    if (this.props.onHighlight) {
      this.props.onHighlight()
    }
  }
  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.switchViewMode(e)
    }
  }
  componentDidUpdate(prevProps) {
    if (this.textInput && this.state.isEdit) {
      this.textInput.select()
    }
  }
  renderView() {
    return (
      <a
        href="#0"
        className="link grey flex-auto h1"
        onClick={this.switchEditMode}
      >
        {this.props.text}
      </a>
    )
  }
  renderEdit() {
    return (
      <input
        autoFocus
        type="text"
        ref={input => (this.textInput = input)}
        className="flex-auto b--grey link"
        onKeyPress={this.handleKeyPress}
        defaultValue={this.props.text}
      />
    )
  }
  render() {
    return (
      <div className={`flex flex-auto items-center pa1`}>
        {this.state.isEdit ? (
          <React.Fragment>
            {this.renderEdit()}
            <i
              className="material-icons green material-icons--small pa1 pointer"
              onClick={this.switchViewMode}
            >
              done
            </i>
          </React.Fragment>
        ) : (
          this.renderView()
        )}
      </div>
    )
  }
}
