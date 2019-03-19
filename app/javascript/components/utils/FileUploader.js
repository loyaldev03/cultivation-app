import React from 'react'
import DashboardModal from '@uppy/react/lib/DashboardModal'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'
import setupUppy from './setupUppy'
import AttachmentThumbnail from './AttachmentThumbnail'

const AddFileButton = ({ onClick }) => (
  <a
    href="#0"
    className="file-uploader__card file-uploader__card--add"
    onClick={onClick}
  >
    <i className="material-icons grey">add</i>
  </a>
)

const FilePreview = ({ onClick, file }) => (
  <div href="#0" className="file-uploader__card">
    <AttachmentThumbnail
      id={file.id}
      url={file.url}
      preview={file.url}
      type={file.mime_type}
      size={50}
      filename=""
      onClick={() => console.log('onClick')}
      showDelete={true}
      onDelete={() => console.log('onDelete')}
    />
  </div>
  // <a href="#0" className="file-uploader__card" onClick={onClick}>
  //   <img src="https://via.placeholder.com/150" />
  // </a>
)

class FileUploader extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isShowUpload: false,
      attachments: []
    }
    this.uppy = setupUppy(this.onUppyComplete)
    console.log('this.uppy', this.uppy)
  }

  onAddFile = () => {
    console.log('onAddFile')
    this.setState({ isShowUpload: !this.state.isShowUpload })
  }

  onCloseUploadDialog = () => {
    console.log('onCloseUploadDialog')
    this.setState({ isShowUpload: false })
    this.uppy.reset()
  }

  onUppyComplete = result => {
    console.log('onUppyComplete:', result)
    if (result.successful) {
      const newAttachments = result.successful.map(file => {
        return {
          id: '',
          key: file.meta.key,
          filename: file.meta.name,
          url: file.preview,
          mime_type: file.type,
          data: JSON.stringify({
            id: file.meta.key.match(/^cache\/(.+)/)[1],
            storage: 'cache',
            metadata: {
              size: file.size,
              filename: file.name,
              mime_type: file.type
            }
          })
        }
      })
      this.setState({
        attachments: [...this.state.attachments, ...newAttachments]
      })
    }
  }

  render() {
    const { className, files } = this.props
    const { isShowUpload } = this.state
    return (
      <React.Fragment>
        <DashboardModal
          uppy={this.uppy}
          closeModalOnClickOutside
          open={isShowUpload}
          onRequestClose={this.onCloseUploadDialog}
          proudlyDisplayPoweredByUppy={false}
          plugins={['Webcam', 'Dropbox', 'AwsS3']}
        />
        <div className={`${className}`}>
          {files &&
            !!files.length &&
            files.map(f => <FilePreview key={f.id} file={f} />)}
          <AddFileButton onClick={this.onAddFile} />
        </div>
      </React.Fragment>
    )
  }
}

export { FileUploader }
