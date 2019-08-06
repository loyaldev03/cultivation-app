import React from 'react'
import { observer } from 'mobx-react'
import { Doughnut } from 'react-chartjs-2'
import Tippy from '@tippy.js/react'
import PeopleDashboardStore from './PeopleDashboardStore'
import 'chartjs-plugin-labels'
import 'chartjs-plugin-doughnutlabel'

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

@observer
export default class HeadCountWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      period: '2019'
    }
  }

  onChangePeriod = period => {
    this.setState({ period: period }, () => {
      PeopleDashboardStore.loadheadCount(this.props.facility_id, period)
    })
  }

  render() {
    const getTotal = function(myDoughnutChart) {
      const sum = myDoughnutChart.config.data.datasets[0].data.reduce(
        (a, b) => a + b,
        0
      )
      return `${sum}`
    }

    return (
      <React.Fragment>
        <div className="flex justify-between mb4">
          <h1 className="f5 fw6 dark-grey">Headcount</h1>
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
          </div>
        </div>
        {PeopleDashboardStore.headcount_loaded ? (
          <Doughnut
            data={PeopleDashboardStore.headCount}
            options={{
              legend: {
                labels: {
                  usePointStyle: true //<-- set this
                },
                position: 'right'
              },
              cutoutPercentage: 60,
              tooltips: {
                enabled: true
              },
              plugins: {
                labels: {
                  overlap: true,
                  fontSize: 14,
                  fontStyle: 'bold',
                  fontColor: 'white',
                  formatter: (value, ctx) => {
                    let sum = 0
                    let dataArr = ctx.chart.data.datasets[0].data
                    dataArr.map(data => {
                      sum += data
                    })
                    let percentage = ((value * 100) / sum).toFixed(2) + '%'
                    return percentage
                  }
                },
                doughnutlabel: {
                  labels: [
                    {
                      text: getTotal,
                      font: {
                        size: '20',
                        weight: 'bold'
                      },
                      color: 'grey'
                    },
                    {
                      text: 'TOTAL',
                      font: {
                        size: '10'
                      },
                      color: 'grey'
                    }
                  ]
                }
              }
            }}
          />
        ) : (
          'loading...'
        )}
      </React.Fragment>
    )
  }
}
