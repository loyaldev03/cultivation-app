import React from 'react'
import { HashRouter as Router, Route, NavLink } from 'react-router-dom'

import BatchesList from './BatchesList'

const WorkPanel = ({ todo, done, ...props }) => (
  <Router>
    <div {...props} >
      <div className="f5 bb bw1 b--black-10 flex">
        <StyledNavLink exact to="/">To Dos</StyledNavLink>
        <StyledNavLink to="/wastes">Material Wastes</StyledNavLink>
        <StyledNavLink to="/issues">Issues</StyledNavLink>
      </div>
      <Route exact path="/" component={BatchesList} />
      <Route path="/wastes" component={Wastes} />
      <Route path="/issues" component={Issues} />
    </div>
  </Router>
)

const Wastes = () => (<div>Wastes ...</div>)
const Issues = () => (<div>Issues ...</div>)

const StyledNavLink = (props) => (
  <NavLink
    className="dib link pv3 ph4 black bw2"
    activeClassName="b--blue b bt"
    {...props} >
    {props.children}
  </NavLink>
)

export default WorkPanel
