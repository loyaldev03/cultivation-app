import React from 'react'
import InlineEditTextField from './InlineEditTextField'
import Calendar from 'react-calendar/dist/entry.nostyle'
import { formatDate2 } from '../../../utils'
import { Manager, Reference, Popper } from 'react-popper'
import Tippy from '@tippy.js/react'

export default class InlineEditDateField extends InlineEditTextField {
  state = {
    value: this.props.text || new Date(),
    isEdit: false
  }
  onChange = value => {
    this.setState({ value })
  }
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
  componentDidUpdate(prevProps) {
    if (prevProps.text !== this.props.text) {
      this.setState({
        value: this.props.text
      })
    }
  }
  renderEdit(text) {
    const { value } = this.state
    // text is Date Object from Task Store
    return (
      <Tippy
        placement="bottom-end"
        trigger="click"
        content={
          <div className="inline_calendar">
            <Calendar value={value} onChange={this.onChange} />
            <input
              type="button"
              className="btn btn--primary "
              value="Add"
              onClick={() => {
                console.log('Button Add Triggered')
              }}
            />
            <input
              type="button"
              className="btn btn--secondary "
              value="Close"
              onClick={() => {
                console.log('Button Close Triggered')
              }}
            />
          </div>
        }
      >
        <span className="flex-auto w2 h1">{formatDate2(value)}</span>
      </Tippy>
    )
  }
}
