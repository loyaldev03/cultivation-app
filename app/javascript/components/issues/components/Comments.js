import React from 'react'
import Avatar from '../../utils/Avatar.js'
class Comments extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="flex ph4 pb3 items-center mt3">
          <div className="f7 fw6 gray w-auto mr1">ISSUE #001</div>
          <div className="f7 fw6 gray w-auto mr1 self-start">&bull;</div>
          <div className="f7 fw6 gray w-auto">Discussion</div>
        </div>
        <div className="flex ph4 mb3">
          <div className="b--black-10 flex br3 ba w-100 pa2">
            <Avatar firstName="Sample" lastName="User" size={25} />
            <input type="text" className="ba0" />
            <span className="material-icons light-gray f6">attach_file</span>
            <span className="material-icons light-gray ml1 f6">add</span>
            <span className="material-icons light-gray ml1 f6">send</span>
          </div>
        </div>
        <div />
      </React.Fragment>
    )
  }
}

export default Comments
