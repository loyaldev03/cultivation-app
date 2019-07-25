import React, { memo, useState, lazy, Suspense } from 'react'
import { observer, action } from 'mobx-react'
import HarvestStore from './HarvestStore'

const AverageWidget = ({
  title,
  count,
  icon,
  className = '',
  loaded = HarvestStore.isLoading
}) => {
  return (
    <div
      className={`ba b--light-gray pa3 bg-white br2 mr3 ${className}`}
      style={{ height: 150 + 'px' }}
    >
      <div className="flex" style={{ flex: ' 1 1 auto' }}>
        <i
          className="material-icons white bg-orange md-48 mt4 mb4"
          style={{ borderRadius: '50%' }}
        >
          {icon}
        </i>
        <div className="tc">
          <h1 className="f5 fw6 grey">{title}</h1>
          <b className="f2 fw6 dark-grey">{loaded ? 'Loading..' : count}</b>
        </div>
      </div>
      {/* {loaded ? (
        
      ) : (
        'loading...'
      )} */}
    </div>
  )
}

@observer
class PlantByRoomWidget extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    HarvestStore.loadAvgHarvestCost(this.props.facility_id)
    HarvestStore.loadAvgHarvestYield(this.props.facility_id)
  }

  render() {
    return (
      <React.Fragment>
        <AverageWidget
          title="Average Cost per gram"
          count={`$ ${
            HarvestStore.average_harvest_cost
              ? HarvestStore.average_harvest_cost
              : 0
          }`}
          icon="attach_money"
          className="mb3"
        />
        <AverageWidget
          title="Average yeild / square feet"
          count={` ${
            HarvestStore.average_harvest_yield
              ? HarvestStore.average_harvest_yield
              : 0
          } lbs`}
          icon="attach_money"
          className="mt3"
        />
      </React.Fragment>
    )
  }
}

export default PlantByRoomWidget
