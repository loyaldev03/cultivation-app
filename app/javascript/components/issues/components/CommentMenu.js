import React from 'react'
import { Manager, Reference, Popper } from 'react-popper'

const MenuButton = ({ icon, text, onClick, className = '' }) => {
  return (
    <a
      className={`pa2 flex link dim pointer items-center ${className}`}
      onClick={onClick}
    >
      <i className="material-icons md-17 pr2">{icon}</i>
      <span className="pr2">{text}</span>
    </a>
  )
}

const CommentMenu = ({
  isOpen,
  id,
  handleEllipsisClick,
  handleMouseLeave,
  handleResolve,
  handleReply
}) => {
  return (
    <Manager>
      <Reference>
        {({ ref }) => {
          return (
            <span
              className="material-icons black-10 hover-dark-gray ph1 pointer"
              style={{ fontSize: '18px', height: '21px' }}
              ref={ref}
              onClick={() => handleEllipsisClick(id)}
            >
              more_vert
            </span>
          )
        }}
      </Reference>
      {isOpen && (
        <Popper placement="bottom-start">
          {({ ref, style, placement, arrowProps }) => (
            <div
              ref={ref}
              style={style}
              data-placement={placement}
              className="bg-white f6 flex"
            >
              <div className="db shadow-4" onMouseLeave={handleMouseLeave}>
                <MenuButton icon="reply" text="Reply" onClick={handleReply} />
                <MenuButton icon="playlist_add" text="Convert to task" />
                <MenuButton
                  icon="check"
                  text="Resolve"
                  onClick={handleResolve}
                />
                <MenuButton icon="edit" text="Edit" />
                <MenuButton icon="delete" text="Delete" />
              </div>
              <div ref={arrowProps.ref} style={arrowProps.style} />
            </div>
          )}
        </Popper>
      )}
    </Manager>
  )
}

export default CommentMenu
