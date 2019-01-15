import React from 'react'

class Comments extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="flex ph4 pb3 items-center mt3">
          <div className="f7 fw6 gray w-auto mr1">
            ISSUE #001
          </div>
          <div className="f7 fw6 gray w-auto mr1 self-start">&bull;</div>
          <div className="f7 fw6 gray w-auto">
            Discussion
          </div>
        </div>
        <div></div>
        <div></div>
      </React.Fragment>
    )
  }
}

export default Comments