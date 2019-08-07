import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { PeopleUserListWidget } from '../utils'
import LetterAvatar from '../utils/LetterAvatar'
import PeopleDashboardStore from './PeopleDashboardStore'

const ProgressBar = React.memo(
  ({
    height = 10,
    percent = 0,
    className = '',
    show = true,
    barColor = 'bg-orange'
  }) => {
    if (!show) return null
    const style = {
      width: `${percent}%`,
      height: height
    }
    return (
      <div
        className={`bg-moon-gray br-pill overflow-y-hidden dib ${className}`}
        style={{ height: height, width: '300px' }}
      >
        <div className={` br-pill shadow-1 ${barColor}`} style={style} />
      </div>
    )
  }
)

@observer
class OntimeArrivalsWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  getProgressBarColor(actual, capacity) {
    if (actual == capacity) {
      return 'bg-green'
    }
    if (actual < capacity) {
      return 'bg-gray'
    }
    if (actual > capacity) {
      return 'bg-red'
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1 className="f5 fw6 black">
          {PeopleDashboardStore.data_worker_lists.title} -{' '}
          {PeopleDashboardStore.current_workers_length} Workers
        </h1>
        <div className="flex justify-between mb2">
          <div className=" flex items-center w-20">
            <h1 className="f5 fw6 gray">Worker</h1>
          </div>
          <div className=" flex items-center w-50">
            <h1 className="f5 fw6 gray">Workload</h1>
          </div>
          <div className=" flex items-center w-20">
            <h1 className="f5 fw6 gray">Skills</h1>
          </div>
          <div className=" flex items-center w-10">
            <h1 className="f5 fw6 gray">Action</h1>
          </div>
        </div>
        {PeopleDashboardStore.data_worker_lists.users.map((e, i) => (
          <div className="flex justify-between mb3">
            <div className="flex items-center w-20">
              {e.photo_url ? (
                <div>
                  <img
                    src={e.photo_url}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '18px'
                    }}
                    onError={x => {
                      x.target.onerror = null
                      x.target.src = DefaultAvatar
                    }}
                  />
                </div>
              ) : (
                <LetterAvatar
                  firstName={e.first_name}
                  lastName={e.last_name}
                  size={36}
                  radius={18}
                />
              )}
              <span className="f6 fw6 dark-grey ml2">
                {e.first_name} {e.last_name}
              </span>
            </div>
            <div className="flex items-center w-50">
              <ProgressBar
                key={i}
                percent={e.user_percentage}
                height={10}
                barColor={this.getProgressBarColor(e.actual, e.capacity)}
              />
              <span className="f6 fw6 dark-grey ml2">
                {e.actual} / {e.capacity} Hours
              </span>
            </div>
            <div className="w-20">
              {e.skills.map(skill => (
                <button className="button mr3 bg-gray bn pa2 tc f6 white">
                  {skill}
                </button>
              ))}
            </div>
            <div className="w-10" href="#" style={{ cursor: 'pointer' }}>
              <button
                className="button mr3 bg-orange bn pa2 tc f5 white"
                style={{ cursor: 'pointer' }}
              >
                Assign Task
              </button>
            </div>
          </div>
        ))}
      </React.Fragment>
    )
  }
}

export default OntimeArrivalsWidget
