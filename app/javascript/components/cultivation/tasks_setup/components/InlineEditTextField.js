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
    const { onDoneClick, onHighlight, text } = this.props
    const { value } = this.textInput
    this.setState({ isEdit: false })
    if (onDoneClick && text !== value) {
      onDoneClick(value)
    }
    if (onHighlight) {
      onHighlight()
    }
  }
  onCancelEdit = e => {
    this.setState({
      isEdit: false,
      value: this.props.text
    })
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
  getViewClassName() {
    return 'link grey flex-auto h1'
  }
  getViewText(text) {
    return text
  }
  renderEdit(text) {
    return (
      <input
        autoFocus
        type="text"
        ref={input => (this.textInput = input)}
        className="flex-auto b--grey link"
        onKeyPress={this.handleKeyPress}
        defaultValue={text}
      />
    )
  }
  render() {
    const { text, editable = true } = this.props
    const { isEdit } = this.state
    if (!editable) {
      return (
        <span className={this.getViewClassName()}>
          {this.getViewText(text)}
        </span>
      )
    }
    if (isEdit) {
      return (
        <React.Fragment>
          {this.renderEdit(text)}
          <i
            className="material-icons green icon--small icon--btn"
            onClick={this.switchViewMode}
          >
            done
          </i>
        </React.Fragment>
      )
    }
    return (
      <a
        href="#0"
        className={this.getViewClassName()}
        onClick={this.switchEditMode}
      >
        {this.getViewText(text)}
      </a>
    )
  }
}
