import React from 'react'
import InlineEditTextField from './InlineEditTextField'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import Calendar from 'react-calendar/dist/entry.nostyle'
import { formatDate2 } from '../../../utils'
import { Manager, Reference, Popper } from 'react-popper'

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
      <Manager>
        <Reference>
          {({ ref }) => (
            <span ref={ref} className="flex-auto w2 h1">
              {formatDate2(value)}
            </span>
          )}
        </Reference>
        <Popper placement="bottom">
          {({ ref, style, placement, arrowProps }) => (
            <div
              ref={ref}
              style={style}
              data-placement={placement}
              className="inline_calendar"
            >
              <div ref={arrowProps.ref} style={arrowProps.style} />
              <Calendar value={value} onChange={this.onChange} />
            </div>
          )}
        </Popper>
      </Manager>
    )
  }
}
