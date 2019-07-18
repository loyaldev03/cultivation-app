import React from 'react'
import { TempBatchWidgets } from '../../../utils'
import { Bar } from 'react-chartjs-2'
import DahboardBatchStore from './DahboardBatchStore'
import { observer } from 'mobx-react'

@observer
export default class BatchPhases extends React.Component {
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
          <h1 className="f5 fw6 dark-grey">Batch In Phases</h1>
        </div>
        {DahboardBatchStore.batch_distribution_loaded ? (
          <Bar data={DahboardBatchStore.batchDistribution} options={options} />
        ) : (
          'loading...'
        )}
      </React.Fragment>
    )
  }
}
