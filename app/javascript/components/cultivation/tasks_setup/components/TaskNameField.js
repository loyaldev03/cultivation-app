import React from 'react'
import classNames from 'classnames'

export default class TaskNameField extends React.PureComponent {
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
  restoreDefault = () => {
    this.textInput.value = this.props.text
    this.setState({ isEdit: false })
  }
  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.switchViewMode(e)
    }
  }
  render() {
    const {
      indent,
      text,
      hasChild,
      isCollapsed,
      onClick,
      onCollapseClick
    } = this.props
    return (
      <div className={`h-100 w-100 pa1 flex items-center indent--${indent}`}>
        {hasChild ? (
          <i
            className="material-icons dim grey f7 pointer"
            onClick={onCollapseClick}
          >
            {isCollapsed ? 'arrow_right' : 'arrow_drop_down'}
          </i>
        ) : (
          <span className="dib indent--1" />
        )}
        {this.state.isEdit ? (
          <React.Fragment>
            <input
              autoFocus
              ref={input => (this.textInput = input)}
              className={classNames('h-100 w-100 b--grey link ph1', {
                orange: hasChild,
                grey: !hasChild
              })}
              onKeyPress={this.handleKeyPress}
              type="text"
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
              className={classNames('pa1 link', {
                orange: hasChild,
                grey: !hasChild
              })}
              onClick={onClick}
            >
              {text}
            </a>
            <i
              className="material-icons material-icons--small pa1 pointer child"
              onClick={this.switchEditMode}
            >
              edit
            </i>
          </React.Fragment>
        )}
      </div>
    )
  }
}
