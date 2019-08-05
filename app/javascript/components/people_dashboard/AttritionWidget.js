import React from 'react'
import { Bar } from 'react-chartjs-2'
import Tippy from '@tippy.js/react'
import PeopleDashboardStore from './PeopleDashboardStore'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import 'chartjs-plugin-labels'

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
const date = new Date()
const roleInit = {
  role_id: '',
  role_name: 'All Job Roles'
}
@observer
export default class AttritionWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      role: {
        role_name: 'All Job Roles',
        role_id: ''
      },
      period: '2019'
    }
  }
  onChangePeriod = period => {
    console.log('Data Role--->' + this.state.role)
    console.log('Data Period--->' + period)
    this.setState({ period: period }, () => {
      PeopleDashboardStore.loadAttrition(
        this.props.facility_id,
        this.state.role.role_id,
        period
      )
    })
  }

  onChangeRoles = role => {
    console.log('Data Role--->' + role.role_id)
    console.log(' Role--->' + JSON.stringify(role))

    console.log('Data Period--->' + this.state.period)
    this.setState({ role: role }, () => {
      PeopleDashboardStore.loadAttrition(
        this.props.facility_id,
        role.role_id,
        this.state.period
      )
    })
  }

  render() {
    const options = {
      legend: {
        display: false
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        custom: function(tooltip) {
          if (!tooltip) return
          // disable displaying the color box;
          tooltip.displayColors = false
        },
        callbacks: {
          label: function(t) {
            if (t.datasetIndex === 0) {
              return 'New Employee: ' + t.yLabel.toString()
            } else if (t.datasetIndex === 1) {
              return 'Leaving Employee: ' + t.yLabel.toString()
            }
          }
        }
      },
      showLines: false,
      plugins: {
        labels: {
          render: 'value'
        }
      },

      scales: {
        xAxes: [
          {
            stacked: true
          }
        ],
        yAxes: [
          {
            stacked: true,
            gridLines: {
              display: false
            },
            ticks: {
              stepSize: 1
            }
          }
        ]
      }
    }
    return (
      <React.Fragment>
        <div className="flex justify-between mb2">
          <h1 className="f5 fw6 dark-grey">Attrition</h1>
          <div className="flex">
            <Tippy
              placement="bottom-end"
              trigger="click"
              duration="0"
              content={
                <div className="bg-white f6 flex">
                  <div className="db shadow-4">
                    <MenuButton
                      key={1}
                      text={'All Job Roles'}
                      className=""
                      onClick={() => this.onChangeRoles(roleInit)}
                    />
                    {PeopleDashboardStore.roles_loaded
                      ? PeopleDashboardStore.data_roles.map(d => (
                          <MenuButton
                            key={d.role_id}
                            text={d.role_name}
                            className=""
                            onClick={() => this.onChangeRoles(d)}
                          />
                        ))
                      : 'loading...'}
                  </div>
                </div>
              }
            >
              <div className="flex ba b--light-silver br2 pointer dim">
                <h1 className="f6 fw6 ml2 grey ttc">
                  {this.state.role.role_name}
                </h1>
                <i className="material-icons grey mr2  md-21 mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </Tippy>
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

        {PeopleDashboardStore.attrition_loaded ? (
          <Bar data={PeopleDashboardStore.attritionCount} options={options} />
        ) : (
          'loading...'
        )}
      </React.Fragment>
    )
  }
}
