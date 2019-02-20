import React from 'react'

const MaterialUsedRow = ({materialId, material, expected, actual, wasted, uom}) => {
  return (
    <div className="flex items-center pv2 justify-between">
      <div className="f6 dark-gray w-40">
        {material}
      </div>
      <div className="f6 dark-gray w-30">
        {expected} {uom}
      </div>
      <div className="f6 dark-gray w-20">
        <input value={actual} className="w-40" ></input>
        <span className="ml2">{uom}</span>
      </div>
      <div className="f6 dark-gray w-20">
        <input value={wasted} className="w-40"></input>
        <span className="ml2">{uom}</span>
      </div>
    </div>
  )
}

export default MaterialUsedRow