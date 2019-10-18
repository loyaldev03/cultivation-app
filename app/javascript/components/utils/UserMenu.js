import React, { useEffect, useRef, useState } from 'react'

function UserMenu({ menuItems }) {
  const node = useRef()
  const [expand, setExpand] = useState(false)
  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])
  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // elided, because clicking inside popup
      return
    }
    // clicking outside popup
    setExpand(false)
  }
  const handleExpand = e => {
    e.preventDefault()
    e.stopPropagation()
    setExpand(!expand)
  }
  return (
    <div ref={node}>
      <span onClick={handleExpand}>+</span>
      {expand && (
        <div className="notification shadow-3 ba br2 b--light-grey fixed top-3 right-1">
          <div className="notification__header">
            <i
              className="pointer material-icons grey icon--medium pa1 fr"
              onClick={() => setExpand(false)}
            >
              close
            </i>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
