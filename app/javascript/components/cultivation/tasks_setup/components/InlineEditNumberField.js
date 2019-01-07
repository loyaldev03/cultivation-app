import React from 'react'
import InlineEditTextField from './InlineEditTextField'

export default class InlineEditNumberField extends InlineEditTextField {
  renderView() {
    return (
      <a
        href="#0"
        className="link grey flex-auto h1 tr"
        onClick={this.switchEditMode}
      >
        {this.props.text}
      </a>
    )
  }
  renderEdit() {
    const { text, min, step } = this.props
    return (
      <input
        autoFocus
        type="number"
        min={min}
        step={step}
        ref={input => (this.textInput = input)}
        className="flex-auto b--grey link tr"
        onKeyPress={this.handleKeyPress}
        defaultValue={text}
      />
    )
  }
}
