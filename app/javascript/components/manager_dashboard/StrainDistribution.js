import React from 'react'
import * as d3 from 'd3'

export default class StrainDistribution extends React.Component {
  componentDidMount() {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    const w = 530 - margin.left - margin.right
    const h = 340 - margin.top - margin.bottom
    const padding = 60
    const svg = d3
      .select('#treemap')
      .append('svg')
      .attr('width', w)
      .attr('height', h)

    const toolTip = d3
      .select('#treemap')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('background-color', 'black')
      .style('padding', '3px')
      .style('border-radius', '5px')
      .style('position', 'absolute')
      .style('text-align', 'center')
      .style('width', '175px')
      .style('height', 'auto')
      .style('font', '14px')
      .style('border', '0px')
      .style('pointer-events', 'none')
      .style('color', 'white')

    const color = d3.scaleOrdinal(d3.schemeSet1)

    d3.json(this.props.url).then(function(data) {
      const root = d3.hierarchy(data).sum(function(d) {
        return d.value
      })
      const kx = w / 2,
        ky = h / 1

      console.log('KX' + kx + 'KY' + ky)

      const treeMap = d3
        .treemap()
        .size([w, h])
        .paddingInner(1)

      treeMap(root)

      const cell = svg
        .selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)
        .on('mousemove', d => {
          toolTip
            .transition()
            .duration(200)
            .style('opacity', 0.75)
          toolTip.attr('data-value', d.data.value)
          toolTip
            .html(d.data.name + '<br>' + d.data.value + ' plant')
            .style('top', `${d3.event.pageY + 10}px`)
            .style('left', `${d3.event.pageX + 8}px`)
        })
        .on('mouseout', d => {
          toolTip
            .transition()
            .duration(200)
            .style('opacity', 0)
        })

      cell
        .append('rect')
        .attr('class', 'tile')
        .attr('data-name', d => d.data.name)
        .attr('data-value', d => d.data.value)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => color(d.data.name))

      cell
        .append('text')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('dx', d => d.data.name.length)
        .attr('opacity', d => ((Math.max(0, d.x1 - d.x0 - 1) > 75) ? (d.x1 - d.x0 - d.data.name.length  > 71 ? 1 : 0) : 0))
        .selectAll('tspan')
        .data(d => d.data.name.split('/\n/g'))
        .enter()
        .append('tspan')
        .style('color', 'white')
        .attr('font-size', '14px')
        .attr('x', 4)
        .attr('y', (d, i) => 13 + 10 * i)
        .text(d => d)
    })
  }

  render() {
    return <div id="treemap" />
  }
}
