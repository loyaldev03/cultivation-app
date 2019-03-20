import React from 'react'
import DashboardModal from '@uppy/react/lib/DashboardModal'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'
import setupUppy from './setupUppy'
import AttachmentThumbnail from './AttachmentThumbnail'
import AttachmentPopup from './AttachmentPopup'

const AddFileButton = ({ onClick }) => (
  <a
    href="#0"
    className="file-uploader__card file-uploader__card--add"
    onClick={onClick}
  >
    <i className="material-icons grey">add</i>
  </a>
)

const FilePreview = ({ onClick, onDelete, file }) => (
  <div className="file-uploader__card hide-child">
    <a
      href="#0"
      style={{ backgroundImage: `url(${file.url})` }}
      className="file-uploader__card__preview"
      onClick={onClick}
    >
      <i className="material-icons child">search</i>
    </a>
    <a
      href="#0"
      className="file-uploader__card__delete child"
      onClick={onDelete}
    >
      <i className="material-icons">delete_outline</i>
    </a>
  </div>
)

class FileUploader extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isShowUpload: false
    }
    this.uppy = setupUppy(this.onUppyComplete)
  }

  onAddFile = () => {
    this.setState({ isShowUpload: !this.state.isShowUpload })
  }

  onCloseUploadDialog = () => {
    this.setState({ isShowUpload: false })
    this.uppy.reset()
  }

  onUppyComplete = result => {
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
      if (this.props.onChange) {
        this.props.onChange([...this.props.attachments, ...newAttachments])
      }
    }
  }

  onTogglePreview = (url = '', type = '') => {
    this.setState({
      previewOpen: !this.state.previewOpen,
      previewUrl: url,
      previewType: type
    })
  }

  onDeleteAttachment = url => {
    const result = confirm('Remove attachment?')
    if (result) {
      if (this.props.onChange) {
        this.props.onChange(this.props.attachments.filter(x => x.url !== url))
      }
    }
  }

  render() {
    const { className, attachments = [] } = this.props
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
          {attachments &&
            attachments.map((f, i) => (
              <FilePreview
                key={i}
                file={f}
                onClick={() => this.onTogglePreview(f.url, f.mime_type)}
                onDelete={() => this.onDeleteAttachment(f.url)}
              />
            ))}
          <AddFileButton onClick={this.onAddFile} />
        </div>
        <AttachmentPopup
          open={this.state.previewOpen}
          key={this.state.previewUrl}
          url={this.state.previewUrl}
          type={this.state.previewType}
          onClose={this.onTogglePreview}
          width="83%"
        />
      </React.Fragment>
    )
  }
}

export { FileUploader }
