import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import DailyTasksStore from '../store/DailyTasksStore'
import LogsAndActivities from './LogsAndActivities'
import MaterialUsed from './MaterialUsed'

@observer
class EditPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected_tab: 0
    }

    this.changeTabs = this.changeTabs.bind(this)
  }

  changeTabs(index) {
    this.setState({ selected_tab: index })
  }

  render() {
    const styles = `
      .active{
        font-weight: bold;
        display: inline-block;
        position: relative;
        border-bottom: 3px solid var(--orange);
        padding-bottom: 16px;
      }

      .active:after {
        position: absolute;
        content: '';
        width: 70%;
        transform: translateX(-50%);
        bottom: -15px;
        left: 50%;
      }
    `

    const tabs = [
      <LogsAndActivities {...this.props} />,
      <MaterialUsed {...this.props} />,
      <Issues {...this.props} />
    ]

    const classWhenActive = (index, className) =>
      this.state.selected_tab == index ? className : ''

    return (
      <div>
        <div
          className="ph3 pv2 mb3 bb b--light-gray flex items-center"
          style={{ height: '51px' }}
        >
          <style>{styles}</style>
          <div className="mt3 flex w-100 tc">
            <div
              className={`w-30 ph2 pointer dim ${classWhenActive(0, 'active')}`}
              onClick={() => this.changeTabs(0)}
            >
              Logs & Activities
            </div>
            <div
              className={`w-40 ph2 pointer dim ${classWhenActive(1, 'active')}`}
              onClick={() => this.changeTabs(1)}
            >
              Material Used
            </div>
            <div
              className={`w-20 ph2 pointer dim ${classWhenActive(2, 'active')}`}
              onClick={() => this.changeTabs(2)}
            >
              Issues
            </div>
          </div>
          <div
            className="pointer"
            onClick={() => {
              DailyTasksStore.editingPanel = null
            }}
          >
            <i className="material-icons mid-gray md-18">close</i>
          </div>
        </div>

        <ScrollableContainer className="f5 pv2 ph4">
          {tabs[this.state.selected_tab]}
        </ScrollableContainer>
      </div>
    )
  }
}

const Issues = () => <div>Issues ...</div>

const ScrollableContainer = styled.div`
  overflow: auto;
  height: calc(100vh - 80px);
`

export default EditPanel
