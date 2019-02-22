import React from 'react'
import { SlidePanelHeader, SlidePanelFooter } from '../../utils'

class NoteEditor extends React.Component {
  onSave = () => {
    this.props.onSave(this.inputText.value)
    this.props.onClose()
  }
  render() {
    const { onClose, onSave } = this.props
    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader onClose={onClose} title={this.props.title} />
        <div className="flex flex-column flex-auto justify-between">
          <div className="pa3 flex flex-column">
            <label className="grey mb2">Notes:</label>
            <textarea
              ref={input => (this.inputText = input)}
              className="dark-grey"
              className="w-100 b--light-grey"
              rows={5}
            />
          </div>
        </div>
        <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
      </div>
    )
  }
}

export default NoteEditor
