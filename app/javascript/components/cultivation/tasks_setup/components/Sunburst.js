import React from 'react'
import * as d3 from 'd3'

class Sunburst extends React.Component {
  componentDidMount() {
    let g = d3
      .select('svg') // <-- 1
      .attr('width', this.props.width) // <-- 2
      .attr('height', this.props.height)
      .append('g') // <-- 3
      .attr(
        'transform',
        'translate(' + this.props.width / 2 + ',' + this.props.height / 2 + ')'
      ) // <-- 4

    let partition = d3
      .partition() // <-- 1
      .size([2 * Math.PI, this.getRadius(this.props.width, this.props.height)])
    const levels = ['section_code', 'row_code', 'shelf_code'],
      structurizedData = this.flatToHierarchy(
        this.props.data,
        levels,
        'tray_code',
        'tray_capacity'
      )
    let root = d3
      .hierarchy(structurizedData) // <-- 1
      .sum(function(d) {
        return d.size
      }) // <-- 2

    partition(root) // <-- 1
    let arc = d3
      .arc() // <-- 2
      .startAngle(function(d) {
        return d.x0
      })
      .endAngle(function(d) {
        return d.x1
      })
      .innerRadius(function(d) {
        return d.y0
      })
      .outerRadius(function(d) {
        return d.y1
      })

    g.selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .append('path')
      .attr('display', function(d) {
        return d.depth ? null : null
      })
      .attr('d', arc)
      .style('stroke', '#fff')
      .on('mouseover', function(d) {
        d3.select(this).style('cursor', 'pointer')

        d3.selectAll('path')
          .filter(function(node) {
            return d.descendants().indexOf(node) >= 0
          })
          .style('fill', function(d) {
            return d.parent ? '#FF7F30' : '#fff'
          })
      })
      .on('mouseout', function(d) {
        //   return d3.color(d.depth ? "#d3d3d3" : "#fff");

        d3.selectAll('path').style('fill', function(d) {
          // if(d && d.data.name === "S02 T01")
          //   return "url(#diagonalHatch)"

          return d3.color(d && d.depth ? '#C7C7C7' : '#fff')
        })
      })
      .on('click', function(d) {
        console.log(d)
        d3.selectAll('path').filter(function(node) {
          return d.descendants().indexOf(node) >= 0
        })
      })
      .style('fill', function(d) {
        // if(d && d.data.name === "S01 T01")
        //   return "url(#diagonalHatch)"

        return d3.color(d.depth ? '#C7C7C7' : '#fff')
      })

    let that = this
    g.selectAll('.node') // <-- 1
      .append('text') // <-- 2
      .attr('font-weight', 'bold')
      .attr('transform', function(d) {
        return (
          'translate(' +
          arc.centroid(d) +
          ')rotate(' +
          that.computeTextRotation(d) +
          ')'
        )
      }) // <-- 3
      .attr('dx', function(d) {
        return d.parent ? '-20' : '-10'
      }) // <-- 4
      .attr('dy', function(d) {
        return d.parent ? '.5em' : '-1.5em'
      })
      .style('pointer-events', 'none')
      .style('font-size', '0.8em')
      .style('fill', function(d) {
        return d.parent ? '#FFF' : '#707A8B'
      }) // <-- 5
      .text(function(d) {
        return d.data ? d.data.name : ''
      }) // <-- 6
  }

  computeTextRotation = d => {
    let angle = ((d.x0 + d.x1) / Math.PI) * 90
    // Avoid upside-down labels; labels as rims
    return angle < 90 || angle > 270 ? angle : angle + 180
  }

  getRadius = (width, height) => {
    return Math.min(width, height) / 2
  }
  flatToHierarchy = (flatData, levels, nameField, countField) => {
    // Adapted from https://stackoverflow.com/a/19317823
    let nestedData = { name: flatData[0].facility_code, children: [] }

    // For each data row, loop through the expected levels traversing the output tree
    flatData.forEach(function(d) {
      // Keep this as a reference to the current level
      let depthCursor = nestedData.children
      // Go down one level at a time
      levels.forEach(function(property, depth) {
        // See if a branch has already been created
        let index
        depthCursor.forEach(function(child, i) {
          if (d[property] == child.name) index = i
        })
        // Add a branch if it isn't there
        if (isNaN(index)) {
          depthCursor.push({ name: d[property], children: [] })
          index = depthCursor.length - 1
        }
        // Reference the new child array as we go deeper into the tree
        depthCursor = depthCursor[index].children
        // This is a leaf, so add last element to specified branch
        if (depth === levels.length - 1) {
          depthCursor.push({
            name: d[nameField],
            count: +d[countField],
            size: 1
          })
        }
      })
    })

    // sum up the leaves / branches and return the hierarchy
    return nestedData
  }
  getUnique = (arr, comp) => {
    const unique = arr
      .map(e => e[comp])
      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
      // eliminate the dead keys & store unique objects
      .filter(e => arr[e])
      .map(e => arr[e])
    return unique
  }
  render() {
    return (
      <svg
        style={{ width: this.props.width, height: this.props.height }}
        id={`sunburst`}
        className="pt3"
      >
        <pattern
          id="diagonalHatch"
          patternUnits="userSpaceOnUse"
          width="10"
          height="10"
        >
          <rect width="10" height="10" fill="#C7C7C7" />
          <path
            d="M-1,1 l2,-2
           M0,10 l10,-10
           M9,11 l2,-2"
            style={{
              stroke: 'orange',
              width: 4,
              height: 8,
              margin: '4em',
              strokeWidth: '2',
              strokeDashoffset: '100'
            }}
          />
        </pattern>
      </svg>
    )
  }
}

export default Sunburst
