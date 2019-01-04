import React from 'react'
import classNames from 'classnames'

export default class TaskNameField extends React.PureComponent {
  state = {
    isEdit: false
  }
  switchEditMode = e => {
    this.setState({ isEdit: true })
  }
  switchViewMode = e => {
    const { onDoneClick } = this.props
    this.setState({ isEdit: false })
    if (onDoneClick) {
      onDoneClick(this.textInput.value)
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
      <span
        className={`h-100 w-100 pa1 dib flex items-center indent--${indent}`}
      >
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
      </span>
    )
  }
}
