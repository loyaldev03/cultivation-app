import Uppy from '@uppy/core'
import Webcam from '@uppy/webcam'
import Dropbox from '@uppy/dropbox'
import AwsS3 from '@uppy/aws-s3'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'

const setupUppy = (
  onComplete = result => {
    result
  }
) => {
  const uppy = Uppy({
    autoProceed: true,
    allowMultipleUploads: false,
    restrictions: {
      maxNumberOfFiles: 5
    }
  })

  uppy.use(Webcam)
  uppy.use(Dropbox, {
    companionUrl: location.protocol + '//' + location.host
  })

  uppy.use(AwsS3, {
    companionUrl: location.protocol + '//' + location.host
  })

  uppy.on('complete', onComplete)
  return uppy
}

export default setupUppy
