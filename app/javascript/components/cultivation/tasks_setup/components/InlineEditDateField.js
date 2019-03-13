import React from 'react'
import InlineEditTextField from './InlineEditTextField'
import Calendar from 'react-calendar/dist/entry.nostyle'
import { formatDate2 } from '../../../utils'
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
    const { value, isEdit } = this.state
    // text is Date Object from Task Store
    return (
      <Tippy
        placement="bottom"
        isVisible={isEdit}
        trigger="manual"
        hideOnClick={false}
        content={
          <div className="inline_calendar">
            <Calendar value={value} onChange={this.onChange} />
            <input
              type="button"
              className="btn btn--primary btn--small"
              value="Ok"
              onClick={this.switchViewMode}
            />
            <input
              type="button"
              className="btn btn--secondary btn--small fr"
              value="Cancel"
              onClick={this.onCancelEdit}
            />
          </div>
        }
      >
        <span className="flex-auto w2 h1">{formatDate2(value)}</span>
      </Tippy>
    )
  }
}
