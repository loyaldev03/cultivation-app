import React, { Component } from 'react'

const AddFileButton = ({ onClick }) => (
  <a
    href="#0"
    className="file-uploader__card file-uploader__card--add"
    onClick={onClick}
  >
    <i className="material-icons grey pa4">add</i>
  </a>
)

const FilePreview = ({ onClick }) => (
  <a href="#0" className="file-uploader__card" onClick={onClick}>
    <img src="https://via.placeholder.com/150" />
  </a>
)

class FileUploader extends React.PureComponent {
  render() {
    const { className, files } = this.props
    return (
      <div className={`${className}`}>
        {files && !!files.length && files.map(f => <FilePreview key={f.id} />)}
        <AddFileButton />
      </div>
    )
  }
}

export { FileUploader }
