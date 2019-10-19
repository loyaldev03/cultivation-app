import React from 'react'

const NoData = React.memo(({ text = '' }) => (
  <div className="flex justify-center mt5">
    <span className="fw6 gray dim i">{text || 'No record found'}</span>
  </div>
))

export { NoData }
