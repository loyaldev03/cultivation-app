import React from 'react'
import InlineEditTextField from './InlineEditTextField'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { formatDate2 } from '../../../utils'
import { parse } from 'date-fns'

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
    const dateValue = parse(text) || new Date()
    return (
      <DatePicker
        className="absolute"
        calendarIcon={null}
        clearIcon={null}
        value={dateValue}
      />
    )
  }
}
