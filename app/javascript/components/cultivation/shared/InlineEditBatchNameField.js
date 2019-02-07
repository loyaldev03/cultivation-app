import React from 'react'
import classNames from 'classnames'
import InlineEditTextField from '../tasks_setup/components/InlineEditTextField'

export default class InlineEditBatchNameField extends InlineEditTextField {
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
      <div
        className={`flex flex-auto items-center indent--${indent}`}
        draggable={true}
      >
        {this.state.isEdit ? (
          <React.Fragment>
            <input
              autoFocus
              ref={input => (this.textInput = input)}
              className={classNames('flex-auto b--grey link', {
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
        ) : (
          <React.Fragment>
            {this.props.issue_available == true && !hasChild ? (
              <a href="http://localhost:3000/cultivation/batches/5c4fc4b5fb8387afc21f969c/issues">
                <i className="material-icons icon--small red" value="">
                  error
                </i>
              </a>
            ) : null}
            <a
              href="#0"
              className={classNames('link', {
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
        )}
      </div>
    )
  }
}
