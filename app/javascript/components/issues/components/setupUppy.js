import Uppy from '@uppy/core'
import Webcam from '@uppy/webcam'
import Dropbox from '@uppy/dropbox'
import AwsS3 from '@uppy/aws-s3'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'

const setupUppy = (onComplete = (result) => { result }) => {
  const uppy = Uppy({
    autoProceed: true,
    allowMultipleUploads: false,
    restrictions: {
      maxNumberOfFiles: 5
    }
  })

  uppy.use(Webcam)
  uppy.use(Dropbox, {
    serverUrl: location.protocol + '//' + location.host
  })

  uppy.use(AwsS3, {
    serverUrl: location.protocol + '//' + location.host
  })

  uppy.on('complete', onComplete)
  // uppy.on('file-added', (file) => {
  //   console.log(file)
  //   let reader = new FileReader()
  //   const d = reader.readAsDataURL(file)
  //   console.log(d)
  // })

  uppy.on('upload-success', (file, resp, uploadURL) => {
    console.log(file)
  })
  return uppy
}

export default setupUppy