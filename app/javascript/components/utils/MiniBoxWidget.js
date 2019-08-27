import React from 'react'

const MiniBoxWidget = React.memo(({ icon = 'check_circle', title, value }) => (
  <div className="flex items-center">
    <i className="material-icons orange md-48 pr2">{icon}</i>
    <div className="flex flex-column pl2 pr3">
      <span className="f5 fw6 grey pb2">{title}</span>
      <span className="f2 fw6 dark-grey">{value}</span>
    </div>
  </div>
))

export { MiniBoxWidget }
