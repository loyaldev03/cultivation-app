import React from 'react'
import isEmpty from 'lodash.isempty'

const PlantTagList = ({ onDelete, plantTags = [] }) => {
  if (isEmpty(plantTags)) {
    return <p className="mv1 i light-grey">Nothing yet.</p>
  }
  return (
    <ol className="clippings">
      {plantTags.map(tag => (
        <li key={tag} className="clippings__item hide-child">
          <span className="flex items-center">
            {tag}
            <i
              className="ml2 material-icons md-16 child pointer"
              onClick={() => onDelete(tag)}
            >
              delete_outline
            </i>
          </span>
        </li>
      ))}
    </ol>
  )
}

export default PlantTagList
