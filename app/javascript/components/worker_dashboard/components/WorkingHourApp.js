import React from 'react'
import Tippy from '@tippy.js/react'
import { Bar } from 'react-chartjs-2'
import { observer } from 'mobx-react'
import { Loading, NoData } from '../../utils'
import workerDashboardStore from '../stores/WorkerDashboardStore'
import isEmpty from 'lodash.isempty'
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
@observer
export default class WorkingHourApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRange: this.props.arr_ranges[0],
      arr_ranges: this.props.arr_ranges
    }
    workerDashboardStore.loadworkerWorkingHours(this.props.arr_ranges[0].val)
  }

  onChangeRange = selectedRange => {
    this.setState({ selectedRange: selectedRange })
    workerDashboardStore.loadworkerWorkingHours(selectedRange.val)
  }

  render() {
    const { arr_ranges } = this.state
    const options = {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        bodyFontSize: 16,
        bodyFontStyle: 'bold',
        borderColor: 'grey',
        bodyAlign: 'center',
        xAlign: 'center',
        xPadding: 20,
        yPadding: 15,
        _bodyAlign: 'center',
        _footerAlign: 'center',
        custom: function(tooltip) {
          if (!tooltip) return
          // disable displaying the color box;
          tooltip.displayColors = false
        },
        callbacks: {
          title: function(tooltipItem, data) {
            return
          },
          label: function(t) {
            if (t.datasetIndex === 0) {
              return t.xLabel.toString() + ' . ' + t.yLabel.toString() + ' hr'
            } else if (t.datasetIndex === 1) {
              return (
                (
                  workerDashboardStore.data_working_hour.hourly_rate * t.yLabel
                ).toString() + ' $'
              )
            }
          }
        }
      },
      showLines: false,
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            },
            barPercentage: 0.3
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              callback: function(label, index, labels) {
                return label + ' hr'
              },
              beginAtZero: true
            }
          }
        ]
      }
    }
    return (
      <React.Fragment>
        <div className="flex justify-between mb4">
          <h1 className="f5 fw6 dark-grey">Working Hours</h1>

          <Tippy
            placement="bottom-end"
            trigger="click"
            duration="0"
            content={
              <div className="bg-white f6 flex">
                <div className="db shadow-4">
                  {arr_ranges.map((e, i) => (
                    <MenuButton
                      key={i}
                      text={e.label}
                      className=""
                      onClick={() => this.onChangeRange(e)}
                    />
                  ))}
                </div>
              </div>
            }
          >
            <div className="flex ba b--light-silver br2 pointer dim">
              <h1 className="f6 fw6 ml2 grey">
                {this.state.selectedRange.label}
              </h1>
              <i className="material-icons grey mr2  md-21 mt2">
                keyboard_arrow_down
              </i>
            </div>
          </Tippy>
        </div>
        {workerDashboardStore.working_hour_loaded ? (
          isEmpty(workerDashboardStore.data_working_hour.data) ? (
            <NoData text="Graph is not available" />
          ) : (
            <div>
              <h1 className="f5 fw6 grey">
                Rate: {workerDashboardStore.data_working_hour.hourly_rate} $/hr
              </h1>
              <Bar data={workerDashboardStore.workingHours} options={options} />
            </div>
          )
        ) : (
          <Loading />
        )}
      </React.Fragment>
    )
  }
}
