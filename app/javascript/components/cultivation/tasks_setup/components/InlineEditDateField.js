import React from 'react'
import InlineEditTextField from './InlineEditTextField'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { formatDate2 } from '../../../utils'

export default class InlineEditDateField extends InlineEditTextField {
  state = {
    value: this.props.text,
    isEdit: false
  }
  onChange = value => this.setState({ value })
  switchViewMode = e => {
    const { onDoneClick, onHighlight } = this.props
    this.setState({ isEdit: false })
    if (onDoneClick) {
      onDoneClick(this.state.value)
    }
    if (onHighlight) {
      onHighlight()
    }
  }
  getViewClassName() {
    return 'link grey flex-auto h1 tr'
  }
  getViewText(dateText) {
    return formatDate2(dateText)
  }
  renderEdit(text) {
    const { value } = this.state
    // text is Date Object from Task Store
    return (
      <DatePicker
        className="absolute"
        calendarIcon={null}
        clearIcon={null}
        value={value}
        onKeyPress={this.handleKeyPress}
        onChange={this.onChange}
      />
    )
  }
}
