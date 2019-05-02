function fileUpload(fileInput) {
  var imagePreview = document.querySelector('.upload-preview')

  fileInput.style.display = 'none' // uppy will add its own file input

  var uppy = Uppy.Core({
    id: fileInput.id,
    autoProceed: true
  })
    .use(Uppy.FileInput, {
      target: fileInput.parentNode
    })
    .use(Uppy.Informer, {
      target: fileInput.parentNode
    })
    .use(Uppy.ProgressBar, {
      target: imagePreview.parentNode
    })

  uppy.use(Uppy.AwsS3, {
    companionUrl: '/' // will call Shrine's presign endpoint on `/s3/params`
  })

  uppy.on('upload-success', function(file, data) {
    // show image preview
    imagePreview.src = URL.createObjectURL(file.data)

    // construct uploaded file data in the format that Shrine expects
    var uploadedFileData = JSON.stringify({
      id: file.meta['key'].match(/^cache\/(.+)/)[1], // object key without prefix
      storage: 'cache',
      metadata: {
        size: file.size,
        filename: file.name,
        mime_type: file.type
      }
    })

    // set hidden field value to the uploaded file data so that it's submitted with the form as the attachment
    var hiddenInput = fileInput.parentNode.querySelector('.upload-hidden')
    hiddenInput.value = uploadedFileData
  })

  return uppy
}
