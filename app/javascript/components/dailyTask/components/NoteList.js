import React from 'react'

const NoteList = React.memo(({ onEdit, onDelete, notes = [], show = true }) => {
  if (!show) {
    return null
  }
  return (
    <div className="w-100 grey">
      <ul className="list pl0">
        {notes.map(x => (
          <li className="pv1" key={x.id}>
            <div className="flex justify-between item-center">
              <span className="f7 red">TODO: Dec 12 2:10pm</span>
              <div>
                <i
                  className="material-icons pointer icon--xs pr2"
                  onClick={() => onEdit(x.id, x.body)}
                >
                  edit
                </i>
                <i
                  className="material-icons pointer icon--xs"
                  onClick={() => onDelete(x.id)}
                >
                  delete
                </i>
              </div>
            </div>
            <p className="mv0 f6 dark-gray">{x.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
})

export default NoteList
