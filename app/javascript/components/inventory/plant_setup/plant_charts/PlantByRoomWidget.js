import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import * as d3 from 'd3'

@observer
class PlantByRoomWidget extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 },
      width = 530 - margin.left - margin.right,
      height = 340 - margin.top - margin.bottom,
      color = d3.scaleOrdinal(d3.schemeSet1)

    const svg = d3
      .select('#treemap')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    d3.json(
      `/api/v1/dashboard_charts/plant_distribution_room?facility_id=${
        this.props.facility_id
      }`
    ).then(function(data) {
      const root = d3.hierarchy(data).sum(function(d) {
        return d.value
      })

      d3
        .treemap()
        .size([width, height])
        .padding(2)(root)

      svg
        .selectAll('rect')
        .data(root.leaves())
        .enter()
        .append('rect')
        .attr('x', function(d) {
          return d.x0
        })
        .attr('y', function(d) {
          return d.y0
        })
        .style('width', d => Math.max(0, d.x1 - d.x0 - 1) + 'px')
        .style('height', d => Math.max(0, d.y1 - d.y0 - 1) + 'px')
        .style('fill', d => {
          while (d.depth > 1) d = d.parent
          return color(d.data.name)
        })

      svg
        .selectAll('text')
        .data(root.leaves())
        .enter()
        .append('text')
        .attr('x', function(d) {
          return d.x0 + 5
        }) // +10 to adjust position (more right)
        .attr('y', function(d) {
          return d.y0 + 20
        }) // +20 to adjust position (lower)
        .text(function(d) {
          return d.data.name
        })
        .attr('font-size', '12px')
        .attr('fill', 'white')
        .append('tspan')
        .attr('x', function(d) {
          return d.x0 + 5
        })
        .attr('y', function(d) {
          return d.y0 + 40
        })
        .text(function(d) {
          return d.data.value + ' plants'
        })
    })
  }

  render() {
    return <React.Fragment>{<div id="treemap" />}</React.Fragment>
  }
}

export default PlantByRoomWidget
