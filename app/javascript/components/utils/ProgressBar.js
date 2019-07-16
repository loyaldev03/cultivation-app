import React from 'react'

const ProgressBar = React.memo(
  ({ height = 10, percent = 0, className = '', show = true, barColor = 'bg-orange' }) => {
    if (!show) return null
    const style = {
      width: `${percent}%`,
      height: height
    }
    return (
      <div
        className={`bg-moon-gray br-pill overflow-y-hidden ${className}`}
        style={{ height: height }}
      >
        <div className={` br-pill shadow-1 ${barColor}`} style={style} />
      </div>
    )
  }
)

export { ProgressBar }
