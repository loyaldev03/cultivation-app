import React from 'react'
import { sortData } from './DrawLineBarChart';

export default class WorkerCapacityChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: this.props.width || 450,
      height: this.props.height || 250,
    };
  }

  componentDidMount() {
    console.log('load data chart')
    const result = {
      xTicks: [30, 25, 20, 15, 10, null, null],
      data: this.props.data,
    };

    const resp = sortData(result.data);
    const { barDatasets, lineDatasets, xlabel, tooltipLabel, barColors, lineColors } = resp;

    var config = {
      type: 'bar',
      data: {
        datasets: [
          {
            label: 'Line Dataset',
            data: lineDatasets,
            fill: false,
            backgroundColor: lineColors,
            borderColor: lineColors,

            // Changes this dataset to become a line
            type: 'line',
          },
          {
            label: 'Bar Dataset',
            data: barDatasets,
            backgroundColor: barColors,
            borderColor: barColors,
          },
        ],
        labels: xlabel,
      },
      options: {
        responsive: false,
        legend: {
          display: false,
        },
        elements: {
          line: {
            tension: 0,
          },
        },
        scales: {
          xAxes: [
            {
              type: 'category',
              id: 'axis-bar',
              barThickness: 10,
              gridLines: {
                display: false,
                drawBorder: false,
              },
              categoryPercentage: 1.0,
              barPercentage: 1.0,
            },
            {
              type: 'time',
              id: 'axis-time',
              display: false,
              gridLines: {
                display: false,
                drawBorder: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                callback: function (tickValue, index, ticks) {
                  return result.xTicks[index];
                },
                beginAtZero: true,
                fixedStepSize: 5,
                max: 30,
                min: 0,
                padding: 15,
              },
              gridLines: {
                color: '#eceded',
                display: true,
                drawBorder: false,
                zeroLineWidth: 0,
                lineWidth: [1, 1, 1, 1, 1, 0, 0],
              },
              max: 30,
              min: 0,
            },
          ],
        },
        tooltips: {
          callbacks: {
            title: () => {
              return '                            ';
            },
            beforeLabel: (tooltipItems, data) => {
              return `${tooltipLabel[tooltipItems.index].actual}`;
            },
            label: (tooltipItems, data) => {
              return `${tooltipLabel[tooltipItems.index].needed}`;
            },
            footer: () => {
              return '                            ';
            },
          },
          bodyFontColor: '#111',
          backgroundColor: '#fff',
          xPadding: 10,
          yPadding: -7,
          bodyFontSize: 13,
          titleFontSize: 11,
          footerFontSize: 11,
          titleFontColor: '#111',
          titleAlign: 'left',
          displayColors: false,
          cornerRadius: 0,
          position: 'nearest',
          yAlign: 'bottom',
          xAlign: 'center',
          caretPadding: 15,
          borderColor: 'rgba(0, 0, 0, 0.35)',
          borderWidth: 1,
        },
        plugins: {
          datalabels: {
            display: false,
          },
        },
      },
    };

    var myChart = new Chart(this.mixLineBarChart, config);
  }

  render() {
    const { width, height } = this.state;

    return (
      <React.Fragment>
        <div className="barChart">
          <canvas
            className="m-auto"
            ref={mixLineBarChart => (this.mixLineBarChart = mixLineBarChart)}
            width={width}
            height={height}
          />
        </div>
      </React.Fragment>
    )
  }
}