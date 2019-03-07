import React from 'react'
import Tippy from '@tippy.js/react'

const MenuButton = React.memo(({ icon, text, onClick, className = '' }) => {
  return (
    <a
      className={`pa2 flex link dim pointer items-center ${className}`}
      onClick={onClick}
    >
      <i className="material-icons md-17 pr2">{icon}</i>
      <span className="pr2">{text}</span>
    </a>
  )
})

const CommentMenu = ({
  isOpen,
  isMe,
  id,
  handleEllipsisClick,
  handleMouseLeave,
  handleResolve,
  handleReply,
  handleEdit,
  handleDelete
}) => {
  return (
    <Tippy
      placement="bottom-start"
      trigger="click"
      content={
        isOpen ? (
          <div className="bg-white f6 flex grey">
            <div className="db shadow-4" onMouseLeave={handleMouseLeave}>
              <MenuButton icon="reply" text="Reply" onClick={handleReply} />
              <MenuButton icon="playlist_add" text="Convert to task" />
              <MenuButton icon="check" text="Resolve" onClick={handleResolve} />
              {isMe && (
                <MenuButton icon="edit" text="Edit" onClick={handleEdit} />
              )}
              {isMe && (
                <MenuButton
                  icon="delete"
                  text="Delete"
                  onClick={handleDelete}
                />
              )}
            </div>
          </div>
        ) : (
          ''
        )
      }
    >
      <span
        className="material-icons black-10 hover-dark-gray ph1 pointer"
        style={{ fontSize: '18px', height: '21px' }}
        onClick={() => handleEllipsisClick(id)}
      >
        more_vert
      </span>
    </Tippy>
  )
}

export default CommentMenu
