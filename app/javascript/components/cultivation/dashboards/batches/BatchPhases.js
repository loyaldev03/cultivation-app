import React from 'react'
import { TempBatchWidgets } from '../../../utils'
import { Bar } from 'react-chartjs-2'
import BatchStore from './DashboardBatchStore'
import { observer } from 'mobx-react'
import PlantStore from '../../../inventory/plant_setup/plant_charts/PlantStore'

@observer
export default class BatchPhases extends React.Component {
  constructor(props) {
    super(props)
    PlantStore.loadPlantDistribution('all', this.props.facility_id)
  }

  render() {
    const options = {
      maintainAspectRatio: false,
      responsive: true,
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
              return 'Batch: ' + t.yLabel.toString()
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
          <h1 className="f5 fw6 dark-grey">Batch In Phases</h1>
        </div>
        {PlantStore.plant_distribution_loaded ? (
          <div style={{ overflow: 'auto', height: '320px' }}>
            <Bar
              data={PlantStore.plantDistribution}
              options={options}
            />
          </div>
        ) : (
          'loading...'
        )}
      </React.Fragment>
    )
  }
}
