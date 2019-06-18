import React from 'react'

class GridGroupEmblem extends React.PureComponent {
  render() {
    let { size } = this.props
    let bgColor = [222, 222, 222]
    const style = {
      backgroundColor: '#5ba623',
      width: size,
      height: size,
      fontSize: '1em',
      lineHeight: size + 'px',
      color: 'rgba(233,233,233,1)',
      textAlign: 'center',
      cursor: 'inherit',
      display: 'inline-block',
      borderRadius: '100%',
      marginBottom: '-2em'
    }
    return (
      <span style={style}>
        <i className="material-icons" style={{ lineHeight: 'inherit' }}>
          toys
        </i>
      </span>
    )
  }
}

export default GridGroupEmblem
