import 'babel-polyfill'
import React from 'react'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import FileInput from '@uppy/file-input'
import './AvatarPicker.scss'

class AvatarPicker extends React.PureComponent {
  constructor(props) {
    super(props)

    this.uppy = new Uppy({
      autoProceed: true,
      restrictions: {
        // max 1mb
        maxFileSize: 1000000,
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*']
      }
    }).use(XHRUpload, { endpoint: '/images/upload', fieldName: 'file' })

    this.uppy.on('upload-success', (file, data) => {
      if (this.props.onUploadSuccess) {
        this.props.onUploadSuccess(data)
      }
    })
  }

  componentWillUnmount() {
    this.uppy.close()
  }

  componentDidMount() {
    this.uppy.use(FileInput, { target: '.UploadButton' })
  }

  render() {
    return (
      <a
        href="#0"
        onClick={this.onShowAvatarPicker}
        className="UploadButton child pa1 absolute white f6 bg-black-50 left-0 bottom-0 link w-100"
      />
    )
  }
}

export default AvatarPicker
