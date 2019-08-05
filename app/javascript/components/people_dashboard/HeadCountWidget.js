import React from 'react'
import { observer } from 'mobx-react'
import { Doughnut } from 'react-chartjs-2'
import PeopleDashboardStore from './PeopleDashboardStore'
import 'chartjs-plugin-labels'
import 'chartjs-plugin-doughnutlabel'

@observer
export default class HeadCountWidget extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    const getTotal = function(myDoughnutChart) {
      const sum = myDoughnutChart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);
      return `${sum}`;
    }
    return (
      <React.Fragment>
        <div className="flex justify-between mb4">
          <h1 className="f4 fw6 dark-grey">Headcount</h1>
        </div>
        {PeopleDashboardStore.headcount_loaded ? (
          <Doughnut data={PeopleDashboardStore.headCount} options={{
            legend: {
               labels: {
                  usePointStyle: true  //<-- set this
               },
               position: "right"
               
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
                      let sum = 0;
                      let dataArr = ctx.chart.data.datasets[0].data;
                      dataArr.map(data => {
                          sum += data;
                      });
                      let percentage = (value*100 / sum).toFixed(2)+"%";
                      return percentage;
                  },
                  
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
                    text: "TOTAL",
                    font: {
                      size: '10'
                    },
                    color: 'grey'
                  }
                ]
              }

          }
          

            
         }}/>
        ) : (
          'loading...'
        )}
      </React.Fragment>
    )
  }
}
