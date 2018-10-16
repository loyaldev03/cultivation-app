import React from 'react'
import { render } from 'react-dom'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'

@observer
class IssueList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: this.props.batch
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>Issue List Here</h1>
      </React.Fragment>
    )
  }
}

export default IssueList
