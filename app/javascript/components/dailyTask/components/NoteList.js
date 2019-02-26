import React from 'react'
import { formatAgo } from '../../utils'

const NoteList = React.memo(({ onEdit, onDelete, notes = [], show = true }) => {
  if (!show) {
    return null
  }
  return (
    <div className="w-100 grey">
      <ul className="list pl0">
        {notes.map(x => {
          return (
            <li className="pv1" key={x.id}>
              <div className="flex justify-between item-center">
                <div>
                  {x.u_at && <span className="pr1 f7 blue">{x.u_by}</span>}
                  <span className="f7">{formatAgo(x.u_at)}</span>
                </div>
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
          )
        })}
      </ul>
    </div>
  )
})

export default NoteList
