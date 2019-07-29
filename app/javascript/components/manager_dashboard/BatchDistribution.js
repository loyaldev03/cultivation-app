import React from 'react'
import Tippy from '@tippy.js/react'
import { Bar } from 'react-chartjs-2'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
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
export default class BatchDistribution extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedMonth: this.props.arr_months[0],
      arr_months: this.props.arr_months
    }
  }

  onChangeBatchDistribution = selectedMonth => {
    this.setState({ selectedMonth: selectedMonth })
    console.log(selectedMonth)
    ChartStore.loadBatchDistribution(
      selectedMonth.label,
      this.props.facility_id
    )
  }

  render() {
    const { arr_months } = this.state
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
              return 'Batch: ' + t.yLabel.toString()
            } else if (t.datasetIndex === 1) {
              return 'Plant: ' + t.yLabel.toString()
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
            }
          }
        ]
      }
    }
    return (
      <React.Fragment>
        <div className="flex justify-between mb4">
          <h1 className="f5 fw6 dark-grey">Batch Distribution</h1>

          <Tippy
            placement="bottom-end"
            trigger="click"
            duration="0"
            content={
              <div className="bg-white f6 flex">
                <div className="db shadow-4">
                  {arr_months.map((e, i) => (
                    <MenuButton
                      key={i}
                      text={e.label}
                      className=""
                      onClick={() => this.onChangeBatchDistribution(e)}
                    />
                  ))}
                </div>
              </div>
            }
          >
            <div className="flex ba b--light-silver br2 pointer dim">
              <h1 className="f6 fw6 ml2 grey">
                {this.state.selectedMonth.label}
              </h1>
              <i className="material-icons grey mr2  md-21 mt2">
                keyboard_arrow_down
              </i>
            </div>
          </Tippy>
        </div>
        {ChartStore.batch_distribution_loaded ? (
          <Bar data={ChartStore.batchDistribution} options={options} />
        ) : (
          'loading...'
        )}
      </React.Fragment>
    )
  }
}
