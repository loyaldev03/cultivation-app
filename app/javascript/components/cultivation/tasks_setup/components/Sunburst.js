import React from 'react'
import * as d3 from 'd3'
class Sunburst extends React.Component {
  state = {
    nodeData: [],
    selectedNode: null,
    selectedNodeList: [],
    neighbourNode: [],
    opacity:0,
    top:0,
    left:0,
    sectionName:'',
  }
  arc = d3
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

  getRadius = (width, height) => {
    return Math.min(width, height) / 2
  }
  partition = d3
    .partition() // <-- 1
    .size([2 * Math.PI, this.getRadius(this.props.width, this.props.height)])
  componentDidMount() {
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
    this.partition(root)
    root.descendants().map(d => {
      if (d.data.id === this.props.locationSelected) {
        this.setState({
          selectedNode: d.data.id,
          selectedNodeList: d.descendants(),
          neighbourNode: d.parent ? d.parent.descendants() : []
        })
        this.props.onCodeSelect(d)
      }
    })
    this.setState({ nodeData: root.descendants() })
  }

  componentDidUpdate(prevProp) {
    const { roomChoice } = this.props
    if (roomChoice !== prevProp.roomChoice) {
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
      this.partition(root)
      root.descendants().map(d => {
        if (d.data.id === this.props.locationSelected) {
          this.setState({
            selectedNode: d.data.id,
            selectedNodeList: d.descendants(),
            neighbourNode: d.parent ? d.parent.descendants() : []
          })
          this.props.onCodeSelect(d)
        }
      })
      this.setState({ nodeData: root.descendants() })
    }
  }

  flatToHierarchy = (flatData, levels, nameField, countField) => {
    // Adapted from https://stackoverflow.com/a/19317823
    let nestedData = {
      name: flatData[0].room_name,
      id: flatData[0].room_id,
      meta: flatData[0],
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

  computeTextRotation = d => {
    var angle = ((d.x0 + d.x1) / Math.PI) * 90
    // Avoid upside-down labels; labels as rims
    return angle < 120 || angle > 270 ? angle : angle + 180
    //return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
  }

  onClickNode = d => {
    this.props.onCodeSelect(d)
    this.setState({
      selectedNode: d.data.id,
      selectedNodeList: d.descendants(),
      neighbourNode: d.parent ? d.parent.descendants() : []
    })
  }
  mouseOut = () => {
    this.setState({
      opacity:0,
      sectionName:''
    })
  }
  mouseOver = (e,node) => {
    console.log(e.nativeEvent.offsetX)
    this.setState({
      opacity:0.9,
      sectionName:node.data.name,
      left:e.nativeEvent.offsetX+'px',
      top:e.nativeEvent.offsetY+ 'px',

    })
  }
  render() {
    const {
      nodeData,
      selectedNode,
      opacity,
      top,
      left,
      sectionName,
      selectedNodeList,
      neighbourNode
    } = this.state
    let sliceNode = nodeData.map(d => {
      let fillColor
      if (d.parent) {
        fillColor = '#d3d3d3'
        if (neighbourNode.indexOf(d) >= 0) {
          fillColor = '#ffa36a'
        }
        if (selectedNodeList.indexOf(d) >= 0) {
          fillColor = '#F66830'
        }
      } else {
        fillColor = '#fff'
      }
      return (
        <g  onClick={e => this.onClickNode(d)} key={d.data.id} onMouseOut={this.mouseOut} 
        onMouseOver={e=>this.mouseOver(e,d)}>
          <path id={d.data.id}
            d={this.arc(d)}
            fill={fillColor}
            stroke="#fff"
            className="pointer"
          />
          {d.parent === null && (
            <text
              fill="#FF7F30"
              transform={
                'translate(' +
                this.arc.centroid(d) +
                ')rotate(' +
                this.computeTextRotation(d) +
                ')'
              }
              dy={d.parent ? '' : d.data.meta.section_code ? '-11' : '-15'}
              dx="-22"
              fontWeight="bold"
              style={{ pointerEvents: 'none', fontSize: 'small' }}
            >
              {d.data.name}
            </text>
          )}
        </g>
      )
    })
    return (
      <React.Fragment>
        <div
        style={{
          background:'#fff',
          opacity:opacity,
          position:'relative',
          width:'100px',
          border:'1px solid #ddd',
          top:top,
          left:left,
        }} 
      >
      {sectionName}
      </div>
      <svg style={{ width: this.props.width, height: this.props.height }}>
        <g
          transform={`translate(${this.props.width / 2},${this.props.height /
            2})`}
        >
          {sliceNode}
        </g>
        
      </svg>
      
      </React.Fragment>
    )
  }
}

export default Sunburst
