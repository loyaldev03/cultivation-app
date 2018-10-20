import React from 'react'
import { render } from 'react-dom'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'

@observer
class ResourceList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: this.props.batch
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>Resource List Here</h1>
      </React.Fragment>
    )
  }
}

export default ResourceList
