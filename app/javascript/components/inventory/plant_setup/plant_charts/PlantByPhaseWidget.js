import React from 'react'
import { Bar } from 'react-chartjs-2'
import Tippy from '@tippy.js/react'
import PlantStore from './PlantStore'
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
export default class PlantByPhaseWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 'Grow Phase'
    }
    PlantStore.loadPlantDistribution('Grow Phase', this.props.facility_id)
  }

  onChangeOrder = order => {
    PlantStore.loadPlantDistribution(order, this.props.facility_id)
    this.setState({
      order: order
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
        <div className="flex justify-between mb2">
          <h1 className="f5 fw6 dark-grey">Plant Distribution by Phases</h1>
          <div className="flex">
            <Tippy
              placement="bottom-end"
              trigger="click"
              duration="0"
              content={
                <div className="bg-white f6 flex">
                  <div className="db shadow-4">
                    <MenuButton
                      text={'Grow Phase'}
                      className=""
                      onClick={() => this.onChangeOrder('Grow Phase')}
                    />
                  </div>
                </div>
              }
            >
              <div className="flex ba b--light-silver br2 pointer dim">
                <h1 className="f6 fw6 ml2 grey ttc">{this.state.order}</h1>
                <i className="material-icons grey mr2  md-21 mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </Tippy>
            <br />
          </div>
        </div>
        <h1 className="f5 fw6 grey">
          Total Plants: {PlantStore.data_plant_distribution.total_plant}{' '}
        </h1>
        <br />
        {PlantStore.plant_distribution_loaded ? (
          <Bar data={PlantStore.plantDistribution} options={options} />
        ) : (
          'loading...'
        )}
      </React.Fragment>
    )
  }
}
