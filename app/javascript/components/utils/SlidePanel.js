import React from 'react'
import classNames from 'classnames'

class SlidePanel extends React.Component {
  render() {
    const { show, renderBody } = this.props
    return (
      <div
        style={{
          overflowY: 'auto'
        }}
        className={classNames('rc-slide-panel', {
          'rc-slide-panel--open': show
        })}
      >
        {renderBody(this.props)}
      </div>
    )
  }
}

export { SlidePanel }
