import React from 'react'
import classNames from 'classnames'
import InlineEditTextField from './InlineEditTextField'
import Tippy from '@tippy.js/react'
import currentIssueStore from '../../../issues/store/CurrentIssueStore'
import getIssue from '../../../issues/actions/getIssue'

export default class InlineEditTaskNameField extends InlineEditTextField {
  openSidebar = issue => {
    currentIssueStore.reset()
    currentIssueStore.mode = 'details'
    getIssue(issue.id)
    event.preventDefault()
  }

  render() {
    const {
      indent,
      text,
      hasChild,
      isCollapsed,
      onClick,
      onCollapseClick,
      issues,
      editable
    } = this.props
    return (
      <div
        className={`pa1 flex flex-auto items-center indent--${indent}`}
        draggable={true}
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
              className={classNames('flex-auto b--grey link ph1', {
                orange: hasChild,
                grey: !hasChild
              })}
              onKeyPress={this.handleKeyPress}
              type="text"
              defaultValue={text}
            />
            <i
              className="material-icons green icon--small icon--btn"
              onClick={this.switchViewMode}
            >
              done
            </i>
          </React.Fragment>
        ) : editable ? (
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
              className="material-icons icon--small icon--btn child"
              onClick={this.switchEditMode}
            >
              edit
            </i>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span
              className={classNames('pa1', {
                orange: hasChild,
                grey: !hasChild
              })}
            >
              {text}
            </span>
          </React.Fragment>
        )}
      </div>
    )
  }
}
