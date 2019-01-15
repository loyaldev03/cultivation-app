import React from 'react'

class AttachmentPreview extends React.Component {

  onClose = event => {
    this.props.onClose()
    event.preventDefault()
  }

  renderContent() {
    const { url, type } = this.props

    if (type.startsWith('image')) {
      return <img src={url} className="w-100"/>
    }
    else if (type.startsWith('video')) {
      return (
        <video width="480" height="320" controls controlsList="nodownload" allowFullScreen >
          <source src={url} type="video/mp4" codecs="a_ac3, avc"/>
        </video>
      )
    }
    else {
      return <span className="">No preview available</span>
    }
  }

  render() {
    if (!this.props.open) {
      return null
    }

    const { url, type } = this.props
    return (
      <div 
        className="absolute" 
        style={{ backgroundColor: 'rgba(0,0,0,0.65)', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div style={{ margin: '15px 1px 1px 1px' }}>
          <div className="pv2 ph3 items-start flex justify-end bg-white br3 br--top">
            <a href="#" onClick={this.onClose}>
              <i className="material-icons mid-gray md-18">close</i>
            </a>
          </div>
          <div className="items-start flex justify-center">
            { this.renderContent() }
          </div>
          
          <div className="pt2 pb3 ph3 bg-white br3 br--bottom tc">
            { type.startsWith('image') && 
              <a href={url} target="_blank" className="orange f6 link fw4">Open in new tab</a> }
          </div>
        </div>

      </div>
    )
  }
}


export default AttachmentPreview