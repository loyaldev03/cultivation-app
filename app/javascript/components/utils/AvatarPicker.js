import React from 'react'
import classNames from 'classnames'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import AwsS3 from '@uppy/aws-s3'
import FileInput from '@uppy/file-input'
import ThumbnailGenerator from '@uppy/thumbnail-generator'

import { DefaultAvatar } from '../utils'
import './AvatarPicker.scss'

class AvatarPicker extends React.Component {
  constructor(props) {
    super(props)

    this.uppy = new Uppy({
      meta: { type: 'avatar' },
      autoProceed: true,
      restrictions: {
        // max 1mb
        maxFileSize: 1000000,
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*']
      }
    })

    this.uppy.use(ThumbnailGenerator),
    this.uppy.use(AwsS3, {
      companionUrl: '/'
    })

    this.uppy.on('upload-success', (file, data) => {
      // Reference: https://twin.github.io/better-file-uploads-with-shrine-direct-uploads/
      const uploadedFileData = {
        id: file.meta['key'].match(/^cache\/(.+)/)[1], // remove the Shrine storage prefix
        storage: 'cache',
        metadata: {
          size: file.size,
          filename: file.name,
          mime_type: file.type
        }
      }
      if (this.props.onUploadSuccess) {
        this.props.onUploadSuccess(uploadedFileData)
      }
    })

    this.uppy.on('thumbnail:generated', (file, preview) => {
      if (this.props.onPreviewUpdate) {
        this.props.onPreviewUpdate(preview)
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
    const { defaultUrl } = this.props
    return (
      <React.Fragment>
        <div
          className={classNames('hide-child relative tc fl mb2', {
            'w4 h4 bg-black-10': !defaultUrl
          })}
        >
          <img
            src={defaultUrl}
            className="fl h4 w4"
            onError={e => {
              e.target.onerror = null
              e.target.src = DefaultAvatar
            }}
          />
          <a
            href="#0"
            className="UploadButton child pa1 absolute white f6 bg-red left-0 bottom-0 link w-100"
          />
        </div>
      </React.Fragment>
    )
  }
}

export default AvatarPicker
