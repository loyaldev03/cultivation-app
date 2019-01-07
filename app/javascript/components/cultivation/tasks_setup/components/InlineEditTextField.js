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
  render() {
    const { text, className, renderInput, min, type = 'text' } = this.props
    return (
      <div className={`flex flex-auto items-center ${className}`}>
        {this.state.isEdit ? (
          <React.Fragment>
            <input
              type={type}
              min={min}
              autoFocus
              ref={input => (this.textInput = input)}
              className="flex-auto b--grey link"
              onKeyPress={this.handleKeyPress}
              defaultValue={text}
            />
            <i
              className="material-icons green material-icons--small pa1 pointer"
              onClick={this.switchViewMode}
            >
              done
            </i>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <a
              href="#0"
              className="link flex-auto h1"
              onClick={this.switchEditMode}
            >
              {text}
            </a>
          </React.Fragment>
        )}
      </div>
    )
  }
}
