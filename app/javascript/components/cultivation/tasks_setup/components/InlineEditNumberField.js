import React from 'react'
import InlineEditTextField from './InlineEditTextField'

export default class InlineEditNumberField extends InlineEditTextField {
  renderEdit(text) {
    const { min, step } = this.props
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
