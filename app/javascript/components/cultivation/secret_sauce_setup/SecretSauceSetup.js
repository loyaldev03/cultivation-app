import 'babel-polyfill'
import React from 'react'
import BatchHeader from '../shared/BatchHeader'
import BatchTabs from '../shared/BatchTabs'
import SecretSauce from './components/SecretSauce'
import loadUnresolvedIssueCount from '../../issues/actions/loadUnresolvedIssueCount'

class SecretSauceSetup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: props.batch,
      unresolvedIssueCount: 0
    }
  }

  componentDidMount() {
    loadUnresolvedIssueCount(this.props.batch.id).then(x => {
      this.setState({ unresolvedIssueCount: x.count })
    })
  }

  render() {
    const { batch } = this.props

    return (
      <div className="pa4 w-100 h-100 flex flex-column grey">
        <div id="toast" className="toast animated toast--success" />
        <BatchHeader {...batch} />
        <BatchTabs
          batch={batch}
          currentTab="secretSauce"
          unresolvedIssueCount={this.state.unresolvedIssueCount}
        />
        <div className="pa4 flex flex-column bg-white">
          <SecretSauce batchId={this.props.batch.id} batch={this.props.batch} />
        </div>
      </div>
    )
  }
}

export default SecretSauceSetup
