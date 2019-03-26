import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

class SlidePanelHeader extends React.PureComponent {
  render() {
    return (
      <div>
        <div className="ph4 pv3 bb b--light-grey">
          <h1 className="h6--font dark-grey ma0">{this.props.title}</h1>
        </div>
        <a
          href="#0"
          className="slide-panel__close-button dim"
          onClick={this.props.onClose}
        >
          <i className="material-icons mid-gray md-18 pa1">close</i>
        </a>
      </div>
    )
  }
}

SlidePanelHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func
}

class SlidePanelFooter extends React.PureComponent {
  render() {
    return (
      <div className="pv3 ph4 bt b--light-grey">
        <input
          type="submit"
          className="fr btn btn--primary"
          value="Save"
          onClick={this.props.onSave}
        />
      </div>
    )
  }
}

SlidePanelFooter.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

class SlidePanel extends React.Component {
  render() {
    const { show, renderBody, width = '450px' } = this.props
    return (
      <div
        style={{
          overflowY: 'auto',
          width: width
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

SlidePanel.propTypes = {
  show: PropTypes.bool.isRequired,
  renderBody: PropTypes.func
}

export { SlidePanel, SlidePanelHeader, SlidePanelFooter }
