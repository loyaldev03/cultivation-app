import React from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
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

const options = {
  responsive: false,
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        ticks: {
          beginAtZero: true,
          display: false
        },
        scaleLabel: {
          display: false
        },
        gridLines: {
          display: false,
          color: '#fff',
          zeroLineColor: '#fff',
          zeroLineWidth: 0
        },
        stacked: true
      }
    ],
    yAxes: [
      {
        barThickness: 12,
        gridLines: {
          display: false,
          color: '#fff',
          zeroLineColor: '#fff',
          zeroLineWidth: 0
        },
        ticks: {
          fontSize: 14,
          padding: 52
        },
        stacked: true
      }
    ]
  }
}

@observer
export default class TestResultList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 'top',
      order_type: 'batches'
    }
  }

  parseTestResultData = () => {
    const data = ChartStore.batch_test_result
    const data2 = {
      labels: data.map(e => e.batch),
      datasets: [
        {
          stack: 'stack1',
          label: 'THC',
          backgroundColor: '#60a3bc',
          borderColor: '#60a3bc',
          borderWidth: 1,
          hoverBackgroundColor: '#60a3bc',
          hoverBorderColor: '#60a3bc',
          data: data.map(e => e.thcValue)
        },
        {
          stack: 'stack1',
          label: 'CBD',
          backgroundColor: '#f6b93b',
          borderColor: '#f6b93b',
          borderWidth: 1,
          hoverBackgroundColor: '#f6b93b',
          hoverBorderColor: '#f6b93b',
          data: data.map(e => e.cbdValue)
        },
        {
          stack: 'stack1',
          label: 'Terpenoids',
          backgroundColor: '#3f51b5',
          borderColor: '#3f51b5',
          borderWidth: 1,
          hoverBackgroundColor: '#3f51b5',
          hoverBorderColor: '#3f51b5',
          data: data.map(e => e.terpenoidsValue)
        },
        {
          stack: 'stack1',
          label: 'Residual Pesticides',
          backgroundColor: '#a29cfe',
          borderColor: '#a29cfe',
          borderWidth: 1,
          hoverBackgroundColor: '#a29cfe',
          hoverBorderColor: '#a29cfe',
          data: data.map(e => e.residualPesticidesValue)
        }
      ]
    }
    return data2
  }

  onChangeOrder = order => {
    ChartStore.loadBatchTestResult(order)
    this.setState({ order: order })
  }

  render() {
    const data = this.parseTestResultData(ChartStore.batch_test_result)
    return (
      <div>
        <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Test Results</h1>
          <div className="flex">
            <Tippy
              placement="bottom-end"
              trigger="click"
              duration="0"
              content={
                <div className="bg-white f6 flex">
                  <div className="db shadow-4">
                    <MenuButton
                      text={'Top'}
                      className=""
                      onClick={() => this.onChangeOrder('top')}
                    />
                    <MenuButton
                      text={'Worse'}
                      className=""
                      onClick={() => this.onChangeOrder('worse')}
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
            <Tippy
              placement="bottom-end"
              trigger="click"
              duration="0"
              content={
                <div className="bg-white f6 flex">
                  <div className="db shadow-4">
                    <MenuButton
                      text={'Batches'}
                      className=""
                      // onClick={() => this.onChangeType('yield')}
                    />
                    <MenuButton
                      text={'Strain'}
                      className=""
                      // onClick={() => this.onChangeType('revenue')}
                    />
                  </div>
                </div>
              }
            >
              <div className="flex ba b--light-silver br2 pointer dim ml2">
                <h1 className="f6 fw6 ml2 grey ttc">
                  by {this.state.order_type}
                </h1>
                <i className="material-icons grey mr2  md-21 mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </Tippy>
          </div>
        </div>
        {ChartStore.batch_test_result_loaded ? (
          <div className="overflow-y-scroll" style={{ height: 320 + 'px' }}>
            <HorizontalBar
              data={data}
              height={400}
              width={500}
              options={options}
            />
          </div>
        ) : (
          <span>Loading ...</span>
        )}
      </div>
    )
  }
}
