import React from 'react'

import loadNutrientProfile from './actions/loadNutrientProfile'
import SecretSauce from './components/SecretSauce'
import BatchHeader from '../shared/BatchHeader'
import BatchTabs from '../shared/BatchTabs'
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
    loadNutrientProfile(this.props.batch.nutrient_profile)
    loadUnresolvedIssueCount(this.props.batch.id).then(x => {
      this.setState({ unresolvedIssueCount: x.count })
    })
  }

  render() {
    const { batch } = this.props

    let activeTabs =
      'link bb-r br-r bt-l br-l pv3 ph4 b--black-10 f6 fw6 dark-gray hover-bg-light-gray bg-white'
    let inactiveTabs =
      'link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white'
    return (
      <React.Fragment>
        <BatchHeader
          batch_no={batch.batch_no}
          batch_source={batch.batch_source}
          quantity={batch.quantity}
          status={batch.status}
          name={batch.name}
          id={batch.id}
          strain={batch.strain}
          grow_method={batch.grow_method}
          start_date={batch.start_date}
          total_estimated_cost={batch.total_estimated_cost}
          total_estimated_hour={batch.total_estimated_hour}
          estimated_harvest_date={batch.estimated_harvest_date}
        />
        <BatchTabs
          batch={batch}
          currentTab="secretSauce"
          unresolvedIssueCount={this.state.unresolvedIssueCount}
        />

        <div className="flex flex-column justify-between bg-white box--shadow">
          <div className="pa4">
            <div className="fl w-100 flex flex-column">
              <SecretSauce
                batch_id={this.props.batch_id}
                batch={this.props.batch}
              />
            </div>
          </div>
        </div>

        <div id="toast" className="toast animated toast--success">
          Row Saved
        </div>
        <br />
      </React.Fragment>
    )
  }
}

export default SecretSauceSetup
