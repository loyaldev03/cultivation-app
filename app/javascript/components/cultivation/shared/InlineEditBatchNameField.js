import React from 'react'
import classNames from 'classnames'
import InlineEditTextField from '../tasks_setup/components/InlineEditTextField'

export default class InlineEditBatchNameField extends InlineEditTextField {
  render() {
    const { indent, text, onClick } = this.props
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
              className="flex-auto b--grey link grey"
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
            <a href="#0" className="grey link" onClick={onClick}>
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
