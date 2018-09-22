import React from 'react'
import TodoItem from './TodoItem'

class DoneList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <TodoItem />
        <TodoItem />
      </React.Fragment>
    )
  }
}

export default DoneList
