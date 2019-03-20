import React from 'react'

const AttachmentThumbnail = ({
  id = '',
  url,
  preview,
  type,
  onDelete,
  size = 50,
  filename = '',
  onClick = (url, mime_type) => {},
  showDelete = false
}) => {
  const height = showDelete ? '70px' : '50px'

  return (
    <div
      src="/"
      mime_type={type}
      style={{ width: size, height }}
      className="mr1 overflow-hidden relative hover-photo mb1"
    >
      <Image
        preview={preview}
        type={type}
        filename={filename}
        onClick={onClick}
        size={size}
      />
      <div
        className="zoom-btn"
        style={{ width: size, height: size }}
        url={url}
        onClick={() => onClick(url, type, filename)}
      >
        <i className="material-icons absolute">search</i>
      </div>
      {showDelete && (
        <p
          style={{ width: size, bottom: -10, fontSize: '12px' }}
          className="tc mt1 mb0 delete-btn"
        >
          <a href="#" className="link gray" onClick={() => onDelete(id)}>
            Delete
          </a>
        </p>
      )}
    </div>
  )
}

const Image = ({ preview, type, filename, size }) => {
  if (type.startsWith('image')) {
    return (
      <div
        className="cover"
        style={{
          width: size,
          height: size,
          background: `url(${preview}) no-repeat center center`
        }}
      />
    )
  } else {
    return (
      <div
        className="gray overflow-hidden f7 bg-white ba b--black-05"
        style={{
          width: size,
          height: size
        }}
      >
        VID - {filename}
      </div>
    )
  }
}

export default AttachmentThumbnail
