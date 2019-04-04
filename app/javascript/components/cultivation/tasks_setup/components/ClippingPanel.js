import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import UserStore from '../stores/NewUserStore'
import TaskStore from '../stores/NewTaskStore'

import { SlidePanelHeader, SlidePanelFooter } from '../../../utils'
import Sunburst from './Sunburst'

@observer
class ClippingPanel extends React.Component {
  state = { roomData: null }
  async componentDidMount() {
    this.setState({ roomData: await TaskStore.roomData(this.props.facilityId) })
  }
  render() {
    const { onClose } = this.props
    const { roomData } = this.state
    return (
      <div>
        <SlidePanelHeader onClose={onClose} title={this.props.title} />
        {roomData ? (
          <div className="w-100 tc">
            <Sunburst data={roomData} width="400" height="400" />
          </div>
        ) : null}
      </div>
    )
  }
}
export default ClippingPanel
