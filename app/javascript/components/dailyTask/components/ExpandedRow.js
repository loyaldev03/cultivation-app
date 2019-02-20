import React from 'react'
import MaterialUsedRow from './MaterialUsedRow'

const rightBorder = {borderRight: '1px solid #ccc'}

class ExpandedRow extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="flex justify-end pv3 ph3">
          <a href="#" className="btn btn--primary mr2">Done</a>
          <a href="#" className="btn btn--secondary">I'm stuck</a>
        </div>


        <div className="flex ba b--black-20 ma2 br2">
          <div className="w-60 ph2 pt2 pb3" style={rightBorder}>
            <div className="flex items-center justify-between mb3">
              <span className="gray fw6 f6">Materials</span>
              <a href="#" className="btn btn--secondary f6">Add</a>
            </div>
            <MaterialUsedRow material="Bloodmeal Max Nutrient 360" expected="5" uom="lb" actual="" wasted="" />
            <MaterialUsedRow material="Quick Cup, Set of 5" expected="500" uom="ea" actual="" wasted="" />
            <MaterialUsedRow material="Std glove" expected="500" uom="ea" actual="" wasted="" />
          </div>

          <div className="w-30 ph2 pt2 pb3" style={rightBorder}>
            <div className="flex items-center justify-between mb3">
              <span className="gray fw6 f6">Issues</span>
              <a href="#" className="btn btn--secondary f6">Add</a>
            </div>
          </div>
          
          <div className="w-30 ph2 pt2 pb3">
            <div className="flex items-center justify-between mb3">
              <span className="gray fw6 f6">Notes</span>
              <a href="#" className="btn btn--secondary f6">Add</a>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ExpandedRow