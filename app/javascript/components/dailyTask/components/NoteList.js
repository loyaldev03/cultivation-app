import React from 'react'

const NoteList = React.memo(({ notes = [], show = true }) => {
  if (!show) {
    return null
  }
  return (
    <div className="w-100 grey">
      <ul className="list pl0">
        {notes.map(x => (
          <li className="pv1" key={x.id}>
            <div className="flex justify-between item-center">
              <span className="f7">Dec 12 2:10pm</span>
              <div>
                <i className="material-icons pointer icon--xs pr2">edit</i>
                <i className="material-icons pointer icon--xs">delete</i>
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
