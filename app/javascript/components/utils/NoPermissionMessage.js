import React from 'react'

const NoPermissionMessage = React.memo(({}) => {
  return (
    <div>
      <p className="pa3 bg-light-yellow ba br2 b--light-grey flex items-center">
        <i className="orange material-icons">notification_important</i>
        <span className="pl2">
          You don't have permissions to access this section.
        </span>
      </p>
    </div>
  )
})

export { NoPermissionMessage }
