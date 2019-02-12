import React from 'react'

class AttachmentPopup extends React.Component {
  onClose = event => {
    this.props.onClose()
    event.preventDefault()
  }

  renderContent() {
    const { url, type } = this.props

    if (url.startsWith('blob:')) {
      console.log('strats with')
    }

    if (type.startsWith('image')) {
      return <img src={url} className="w-100" />
    } else if (type.startsWith('video')) {
      return (
        <video
          width="480"
          height="320"
          controls
          controlsList="nodownload"
          allowFullScreen
        >
          <source src={url} type="video/mp4" codecs="a_ac3, avc" />
        </video>
      )
    } else {
      return <span className="">No preview available</span>
    }
  }

  render() {
    if (!this.props.open) {
      return null
    }

    const { url, type } = this.props
    return (
      <React.Fragment>
        <div
          className="fixed"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: 'calc(100vh + 70px)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 80,
            marginLeft: '10px',
            marginRight: '10px',
            width: 'calc(100% - 20px)'
          }}
        >
          <div className="pv2 ph3 items-start flex justify-end bg-white br3 br--top">
            <a href="#" onClick={this.onClose}>
              <i className="material-icons mid-gray md-18">close</i>
            </a>
          </div>
          <div className="items-start flex justify-center bg-white">
            {this.renderContent()}
          </div>

          <div className="pt2 pb3 ph3 bg-white br3 br--bottom tc">
            {type.startsWith('image') && (
              <a href={url} target="_blank" className="orange f6 link fw4">
                Open in new tab
              </a>
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default AttachmentPopup
