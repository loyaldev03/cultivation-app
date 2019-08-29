import React from 'react'
import { observer } from 'mobx-react'
import { HeaderFilter, ListingTable } from '../utils'
import GrowPhaseStore from './GrowPhaseStore'

@observer
class GrowPhaseSetting extends React.Component {
  state = {
    columns: [
      {
        accessor: 'id',
        show: false
      },
      {
        headerClassName: 'tl',
        Header: 'Name',
        accessor: 'name',
        minWidth: 250,
        className: 'ttc'
      },
      {
        Header: (
          <HeaderFilter
            title="Active"
            accessor="is_active"
            getOptions={GrowPhaseStore.getUniqPropValues}
            onUpdate={GrowPhaseStore.updateFilterOptions}
          />
        ),
        accessor: 'is_active',
        width: 100,
        Cell: props => {
          return (
            <div className="center">
              <input
                type="checkbox"
                className="toggle toggle-default"
                onChange={() => {}}
                checked={props.value}
              />
              <label
                className="toggle-button"
                onClick={this.onToggleActive(props.row.id, props.value)}
              />
            </div>
          )
        }
      }
    ]
  }

  componentDidMount() {
    GrowPhaseStore.loadGrowPhase()
  }

  onToggleActive = (id, value) => e => {
    GrowPhaseStore.updateCategory(id, !value)
  }

  render() {
    const { columns } = this.state
    return (
      <React.Fragment>
        <div id="toast" className="toast" />
        <div className="mt0 ba b--light-grey pa3">
          <p className="grey">
            You can decide which phases to be used by setting it to "Active"
          </p>
          <ListingTable
            data={GrowPhaseStore.filteredList}
            columns={columns}
            isLoading={GrowPhaseStore.isLoading}
          />

          <div data-role="sidebar" className="rc-slide-panel">
            <div className="rc-slide-panel__body h-100" />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default GrowPhaseSetting
