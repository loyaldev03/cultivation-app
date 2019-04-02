import React from 'react'

const AdjustmentMessage = React.memo(({ value, total }) => {
  if (value >= 0 && value < total) {
    const res = +total - +value
    return (
      <div className="dib bg-light-yellow pa2 ba br2 b--light-yellow grey w-4 tc">
        You need to select <span className="fw6 dark-grey">{res}</span> more!
      </div>
    )
  }
  if (value > 0 && value > total) {
    const res = +value - +total
    return (
      <div className="dib bg-washed-red pa2 ba br2 b--washed-red grey w-4 tc">
        You need to remove <span className="fw6 dark-grey">{res}</span>{' '}
        plant(s).
      </div>
    )
  }
  return <div />
})

export { AdjustmentMessage }
