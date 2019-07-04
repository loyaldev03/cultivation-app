import Chart from 'chart.js';

import _ from 'lodash';

const DrawLinelBarChart = (ele, props) => {
  const { data } = props;
  let { options } = props;
  const barChart = ele;

  new Chart(barChart, {
    type: 'bar',
    data: data,
    options: options,
  });
};

export const sortData = data => {
  let barDatasets = [];
  let lineDatasets = [];
  let xlabel = [];
  let barColors = [];
  let lineColors = [];
  let tooltipLabel = [];
  let resp = {};

  data = _.sortBy(data, [
    item => {
      return item.index;
    },
  ]);

  _.forEach(data, value => {
    const { actual, needed, stage, actualColor, neededColor } = value;

    barDatasets.push(actual);
    lineDatasets.push(needed);
    xlabel.push(stage);
    barColors.push(actualColor);
    lineColors.push(neededColor);
    tooltipLabel.push({ actual: `Actual: ${actual}`, needed: `Needed: ${needed}` });
  });

  resp['barDatasets'] = barDatasets;
  resp['lineDatasets'] = lineDatasets;
  resp['xlabel'] = xlabel;
  resp['tooltipLabel'] = tooltipLabel;
  resp['barColors'] = barColors;
  resp['lineColors'] = lineColors;
  resp['scaleOverride'] = true;
  resp['scaleSteps'] = 10;
  resp['scaleStepWidth'] = 50;
  resp['scaleStartValue'] = 0;
  return resp;
};

export default DrawLinelBarChart;
