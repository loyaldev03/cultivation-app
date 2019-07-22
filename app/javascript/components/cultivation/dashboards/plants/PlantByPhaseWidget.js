import React from 'react'
import { Bar } from 'react-chartjs-2'
import DashboardPlantStore from './DashboardPlantStore'
import { observer } from 'mobx-react'

@observer
export default class PlantByPhaseWidget extends React.Component {
  constructor(props) {
    super(props)
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
              return 'Plant: ' + t.yLabel.toString()
            } else if (t.datasetIndex === 1) {
              return 'Bacth: ' + t.yLabel.toString()
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
        <div className="flex justify-between">
          <div>
            <h1 className="f5 fw6 dark-grey">Plant Distribution by Phases</h1>
            <h1 className="f5 fw6 grey">Total Plants: {DashboardPlantStore.data_batch_distribution.total_plant} </h1>
          </div>
        </div>
        <br />
        {DashboardPlantStore.batch_distribution_loaded ? (
          <Bar data={DashboardPlantStore.batchDistribution} options={options} />
          
        ) : (
          'loading...'
        )}
      </React.Fragment>
    )
  }
}
