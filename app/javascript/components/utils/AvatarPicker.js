import React from 'react'
import classNames from 'classnames'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import AwsS3 from '@uppy/aws-s3'
import FileInput from '@uppy/file-input'
import ThumbnailGenerator from '@uppy/thumbnail-generator'

import { DefaultAvatar } from '../utils'
import './AvatarPicker.scss'

class AvatarPicker extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      imagePreview: ''
    }

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

    // this.uppy.use(XHRUpload, {
    //   endpoint: '/images/upload',
    //   fieldName: 'file'
    // })

    this.uppy.on('upload-success', (file, data) => {
      console.log('Uppy upload success: file:', data)
      //   console.log('Uppy upload success: status:', resp.status)
      //   console.log('Uppy upload success: body', resp.body)
      if (this.props.onUploadSuccess) {
        this.props.onUploadSuccess(data)
      }
    })

    this.uppy.on('complete', result => {
      console.log('complete', result)
      //   const url = result.successful[0].uploadURL
      //   store.dispatch({
      //     type: SET_USER_AVATAR_URL,
      //     payload: { url: url }
      //  })
    })

    this.uppy.on('thumbnail:generated', (file, preview) => {
      console.log('thum gen', file, preview)
      this.setState({
        imagePreview: preview
      })
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
    const { imagePreview } = this.state
    console.log(imagePreview)
    return (
      <React.Fragment>
        <div
          className={classNames('hide-child relative tc fl mb2', {
            'w4 h4 bg-black-10': !defaultUrl
          })}
        >
          <p>img here</p>
          <img
            src={imagePreview || defaultUrl}
            ref={img => (this.img = img)}
            className="fl h4 w4"
            onError={e => {
              e.target.onerror = null
              e.target.src = DefaultAvatar
            }}
          />
          <p>upload click link here</p>
          <a
            href="#0"
            onClick={this.onShowAvatarPicker}
            className="UploadButton child pa1 absolute white f6 bg-red left-0 bottom-0 link w-100"
          />
        </div>
      </React.Fragment>
    )
  }
}

export default AvatarPicker
