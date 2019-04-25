import React from 'react'
import * as d3 from 'd3'
class Sunburst extends React.Component {
  componentDidMount() {
    let div = d3
      .select('.cursorplacer')
      .append('div')
      .attr('class', 'tooltipSunburst')
      .style('opacity', 0)
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

    this.props.onHaveSection(this.props.data[0].section_code ? true : false)

    let levels = this.props.data[0].section_code
        ? ['section_code', 'row_code', 'shelf_code']
        : ['row_code', 'shelf_code'],
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
    let that = this
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
        div.style('opacity', 0.9)
        div
          .html(d.data.name + '<br/>')
          .style('left', d3.event.pageX - 1000 + 'px')
          .style('top', d3.event.pageY - 28 + 'px')

        d3.select(this).style('cursor', 'pointer')

        // d3.selectAll('path')
        //   .filter(function(node) {
        //     return d.descendants().indexOf(node) >= 0
        //   })
        //   .style('fill', function(d) {
        //     return d.parent ? '#F66830' : '#fff'
        //   })
      })
      .on('mouseout', function(d) {
        //   return d3.color(d.depth ? "#d3d3d3" : "#fff");
        div.style('opacity', 0)
        // d3.selectAll('path').style('fill', function(d) {
        //   // if(d && d.data.name === "S02 T01")
        //   //   return "url(#diagonalHatch)"

        //   return d3.color(d && d.depth ? '#C7C7C7' : '#fff')
        // })
      })
      .on('click', function(d) {
        that.props.onAddTray(d.data)
        that.props.onChoosen(d.data, d.data.hierarchy)
        that.props.onClearTray()
        let child = d.descendants()
        let parent = d.parent ? d.parent.descendants() : []
        d3.selectAll('path')
          .filter(node => node)
          .style('fill', function(d) {
            let color = d3.color(parent.indexOf(d) >= 0 ? '#ffa36a' : '#C7C7C7')
            if (child.indexOf(d) >= 0) {
              color = d3.color('#F66830')
            }
            if (d.parent) {
              return color
            } else {
              return d3.color('#fff')
            }
          })
      })
      .style('fill', function(d) {
        return d3.color(d.depth ? '#C7C7C7' : '#fff')
      })

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
        return d.parent ? '' : ''
      }) // <-- 4
      .attr('dy', function(d) {
        return d.parent ? '' : that.props.data[0].section_code ? '-11' : '-15'
      })
      .style('pointer-events', 'none')
      .style('font-size', '0.8em')
      .style('text-anchor', 'middle')
      .style('fill', function(d) {
        return d.parent ? '#FFF' : '#707A8B'
      }) // <-- 5
      .text(function(d) {
        return d.parent ? '' : d.data.name
      }) // <-- 6
  }

  componentDidUpdate = prevProp => {
    const { roomChoice } = this.props
    if (roomChoice !== prevProp.roomChoice) {
      let div = d3
        .select('html')
        .append('div')
        .attr('class', 'tooltipSunburst')
        .style('opacity', 0)
      let g = d3
        .select('svg') // <-- 1
        .attr('width', this.props.width) // <-- 2
        .attr('height', this.props.height)
        .append('g') // <-- 3
        .attr(
          'transform',
          'translate(' +
            this.props.width / 2 +
            ',' +
            this.props.height / 2 +
            ')'
        ) // <-- 4

      let partition = d3
        .partition() // <-- 1
        .size([
          2 * Math.PI,
          this.getRadius(this.props.width, this.props.height)
        ])
      this.props.onHaveSection(this.props.data[0].section_code ? true : false)
      let levels = this.props.data[0].section_code
          ? ['section_code', 'row_code', 'shelf_code']
          : ['row_code', 'shelf_code'],
        structurizedData = this.flatToHierarchy(
          this.props.data,
          levels,
          'tray_code',
          'tray_capacity'
        )
      this.setState({ renderData: structurizedData })
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
      let that = this
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
          div.style('opacity', 0.9)
          div
            .html(d.data.name + '<br/>')
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY - 28 + 'px')
          d3.select(this).style('cursor', 'pointer')
        })
        .on('mouseout', function(d) {
          div.style('opacity', 0)
        })
        .on('click', function(d) {
          that.props.onAddTray(d.data)
          that.props.onChoosen(d.data, d.data.hierarchy)
          that.props.onClearTray()
          let child = d.descendants()
          let parent = d.parent ? d.parent.descendants() : []
          d3.selectAll('path')
            .filter(node => node)
            .style('fill', function(d) {
              let color = d3.color(
                parent.indexOf(d) >= 0 ? '#ffa36a' : '#C7C7C7'
              )
              if (child.indexOf(d) >= 0) {
                color = d3.color('#F66830')
              }
              if (d.parent) {
                return color
              } else {
                return d3.color('#fff')
              }
            })
        })
        .style('fill', function(d) {
          return d3.color(d.depth ? '#C7C7C7' : '#fff')
        })

      g.selectAll('.node')
        .append('text')
        .attr('font-weight', 'bold')
        .attr('transform', function(d) {
          return (
            'translate(' +
            arc.centroid(d) +
            ')rotate(' +
            that.computeTextRotation(d) +
            ')'
          )
        })
        .attr('dx', function(d) {
          return d.parent ? '' : ''
        })
        .attr('dy', function(d) {
          return d.parent ? '' : that.props.data[0].section_code ? '-11' : '-15'
        })
        .style('pointer-events', 'none')
        .style('font-size', '0.8em')
        .style('text-anchor', 'middle')
        .style('fill', function(d) {
          return d.parent ? '#FFF' : '#707A8B'
        })
        .text(function(d) {
          return d.parent ? '' : d.data.name
        })
      console.log(this.props.locationSelected)
      if (this.props.locationSelected) {
        g.selectAll('path').filter(d => {
          if (d.data.id === that.props.locationSelected) {
            that.props.onAddTray(d.data)
            that.props.onChoosen(d.data, d.data.hierarchy)
            that.props.onClearTray()
            let child = d.descendants()
            let parent = d.parent ? d.parent.descendants() : []
            d3.selectAll('path')
              .filter(node => node)
              .style('fill', function(d) {
                let color = d3.color(
                  parent.indexOf(d) >= 0 ? '#ffa36a' : '#C7C7C7'
                )
                if (child.indexOf(d) >= 0) {
                  color = d3.color('#F66830')
                }
                if (d.parent) {
                  return color
                } else {
                  return d3.color('#fff')
                }
              })
          }
        })
      }
    }
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
    let nestedData = {
      name: flatData[0].room_name,
      id: flatData[0].room_id,
      code: 'room',
      children: []
    }

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
          let id = '',
            hierarchy = ''
          if (property === 'section_code') {
            id = 'section_id'
            hierarchy = 'section'
          } else if (property === 'shelf_code') {
            id = 'shelf_id'
            hierarchy = 'shelf'
          } else {
            id = 'row_id'
            hierarchy = 'row'
          }
          depthCursor.push({
            name: d[property],
            id: d[id],
            meta: d,
            hierarchy,
            children: []
          })
          index = depthCursor.length - 1
        }
        // Reference the new child array as we go deeper into the tree
        depthCursor = depthCursor[index].children
        // This is a leaf, so add last element to specified branch
        if (depth === levels.length - 1) {
          depthCursor.push({
            name: d[nameField],
            count: +d[countField],

            id: d['tray_id'],
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
