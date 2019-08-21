import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { PeopleJobRoleWidget } from '../utils'
import PoepleDashboardStore from './PeopleDashboardStore'
import { toJS } from 'mobx'
import 'chartjs-plugin-labels'
import { Line } from 'react-chartjs-2'
import Tippy from '@tippy.js/react'

const MenuButton = ({ icon, text, onClick, className = '' }) => {
  return (
    <a
      className={`pa2 flex link dim pointer items-center ${className}`}
      onClick={onClick}
    >
      <i className="material-icons md-17 pr2">{icon}</i>
      <span className="pr2">{text}</span>
    </a>
  )
}
const JobRoleLine = ({ icon, jobrole, options, onClick, className = '' }) => {
  let final_result = {
    labels: jobrole.data.map(d => d.month),
    datasets: [
      {
        lineTension: 0,
        label: 'Total Durations in Hour',
        data: jobrole.data.map(d => d.total),
        fill: false,
        borderColor: 'orange'
      }
    ]
  }
  return (
    <div className={'dt-ns w-100'}>
      <div className={'dtc-ns v-mid w-30'}>
        <h4 className={'f5'}>{jobrole.role}</h4>
        <span className={'f6'}>Total Workers: {jobrole.toatal_user}</span>
      </div>
      <div className={'dtc-ns v-mid w-70'}>
        <Line data={final_result} options={options} />
      </div>
    </div>
  )
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    bezierCurve: false,
    scaleShowLabels: false,
    xAxes: [
      {
        position: 'top',
        gridLines: {
          offsetGridLines: false
        }
      }
    ],
    yAxes: [
      {
        gridLines: {
          display: false
        },
        ticks: {
          display: false
        }
      }
    ]
  }
}
const date = new Date()
@observer
class JobRoleWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      period: '2019'
    }
  }

  onChangePeriod = period => {
    this.setState({ period: period }, () => {
      PoepleDashboardStore.loadJobRoles(this.props.facility_id, period)
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-between mb2">
          <h1 className="f5 fw6 dark-grey">Job Roles</h1>
          <div className="flex">
            <Tippy
              placement="bottom-end"
              trigger="click"
              duration="0"
              content={
                <div className="bg-white f6 flex">
                  <div className="db shadow-4">
                    <MenuButton
                      key={date.getFullYear()}
                      text={date.getFullYear()}
                      className=""
                      onClick={() =>
                        this.onChangePeriod(`${date.getFullYear()}`)
                      }
                    />
                    <MenuButton
                      key={date.getFullYear() - 1}
                      text={date.getFullYear() - 1}
                      className=""
                      onClick={() =>
                        this.onChangePeriod(`${date.getFullYear() - 1}`)
                      }
                    />
                    <MenuButton
                      key={date.getFullYear() - 2}
                      text={date.getFullYear() - 2}
                      className=""
                      onClick={() =>
                        this.onChangePeriod(`${date.getFullYear() - 2}`)
                      }
                    />
                  </div>
                </div>
              }
            >
              <div className="flex ba b--light-silver br2 pointer dim">
                <h1 className="f6 fw6 ml2 grey ttc">{this.state.period}</h1>
                <i className="material-icons grey mr2  md-21 mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </Tippy>
            <br />
          </div>
        </div>
        {PoepleDashboardStore.job_roles_loaded ? (
          <div style={{ overflow: 'auto', height: '290px' }}>
            {PoepleDashboardStore.data_job_roles.map((d, i) => (
              <JobRoleLine key={i} jobrole={d} options={options} />
            ))}
          </div>
        ) : (
          'Loading..'
        )}
      </React.Fragment>
    )
  }
}

export default JobRoleWidget
