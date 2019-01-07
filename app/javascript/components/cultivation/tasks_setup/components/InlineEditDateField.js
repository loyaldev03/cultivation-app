import React from 'react'
import InlineEditTextField from './InlineEditTextField'
import { formatDate2 } from '../../../utils'

export default class InlineEditDateField extends InlineEditTextField {
  renderView() {
    return (
      <a
        href="#0"
        className="link grey flex-auto h1 tr"
        onClick={this.switchEditMode}
      >
        {formatDate2(this.props.text)}
      </a>
    )
  }
  renderEdit() {
    const { text } = this.props
    return (
      <input
        autoFocus
        type="text"
        ref={input => (this.textInput = input)}
        className="flex-auto b--grey link tr"
        onKeyPress={this.handleKeyPress}
        defaultValue={text}
      />
    )
  }
}
