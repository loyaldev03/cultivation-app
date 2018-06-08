import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'
const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu

class Sidebar extends React.PureComponent {
  state = {
    collapsed: false
  }

  toggleCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  get currentLink() {
    const index = this.props.menuLinks.indexOf(
      x => x.name === this.props.currentLink
    )

    if (index >= 0) {
      return `menu-${index + 1}`
    } else {
      return `menu-0`
    }

    return 'menu-1'
  }

  renderMenuItems = links => (
    <React.Fragment>
      {links.map((r, i) => (
        <Menu.Item key={`menu-${i}`}>
          <Icon type="desktop" />
          <span>
            <a href={r.url}>{r.name}</a>
          </span>
        </Menu.Item>
      ))}
    </React.Fragment>
  )

  render() {
    const { menuLinks, adminLinks } = this.props

    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        trigger={null}
        style={{ minHeight: '100vh', background: '#CCC' }}
      >
        <div className="logo" />
        <Menu>
          <Menu.Item>Menu</Menu.Item>
          <SubMenu title="SubMenu">
            <Menu.Item>SubMenuItem</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    )
  }
}

Sidebar.propTypes = {
  menuLinks: PropTypes.array,
  adminLinks: PropTypes.array,
  currentLink: PropTypes.string
}

Sidebar.defaultProps = {
  menuLinks: [],
  adminLinks: [],
  currentLink: null
}

export default Sidebar
