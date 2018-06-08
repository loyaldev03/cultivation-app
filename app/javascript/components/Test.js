import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'
const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu

class Test extends React.PureComponent {
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

  render() {
    const menulinks = this.props.menuLinks.map((r, index) => {
      return (
        <Menu.Item key={`menu-${index + 1}`}>
          <Icon type="desktop" />
          <span>
            <a href={r.url}>{r.name}</a>
          </span>
        </Menu.Item>
      )
    })

    const adminLinks = this.props.adminLinks.map((r, index) => {
      return (
        <Menu.Item key={`admin-${index}`}>
          <span>
            <a href={r.url}>{r.name}</a>
          </span>
        </Menu.Item>
      )
    })

    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        trigger={null}
        style={{ minHeight: '100vh', background: '#fff' }}
      >
        <Icon
          key="toggle"
          className="trigger pa3"
          type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggleCollapse}
        />
        <Menu
          theme="light"
          defaultSelectedKeys={[this.currentLink]}
          mode="inline"
        >
          {menulinks}
          {adminLinks}
        </Menu>
      </Sider>
    )
  }

  renderOld() {
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        style={{ minHeight: '100vh', background: '#fff' }}
      >
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1">
            <Icon type="pie-chart" />
            <span>Procurement</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="desktop" />
            <span>Quality</span>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>User</span>
              </span>
            }
          >
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="team" />
                <span>Team</span>
              </span>
            }
          >
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9">
            <Icon type="file" />
            <span>File</span>
          </Menu.Item>
        </Menu>
      </Sider>
    )
  }
}

Test.propTypes = {
  menuLinks: PropTypes.array,
  adminLinks: PropTypes.array,
  currentLink: PropTypes.string
}

Test.defaultProps = {
  menuLinks: [],
  adminLinks: [],
  currentLink: null
}

export default Test
