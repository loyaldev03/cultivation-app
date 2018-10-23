import React from 'react'
import { HashRouter as Router, Route, NavLink } from 'react-router-dom'

import BatchesList from './BatchesList'

const WorkPanel = ({ todo, done, ...props }) => (
  <Router>
    <div {...props}>
      <div className="f5 flex">
        <StyledNavLink exact to="/">
          To Dos
        </StyledNavLink>
        <StyledNavLink to="/wastes">Material Wastes</StyledNavLink>
        <StyledNavLink to="/issues">Issues</StyledNavLink>
      </div>
      <div className="bg-white box--shadow pa4 fl w-100">
        <Route exact path="/" component={BatchesList} />
        <Route path="/wastes" component={Wastes} />
        <Route path="/issues" component={Issues} />
      </div>
    </div>
  </Router>
)

const Wastes = () => <div>Wastes ...</div>
const Issues = () => <div>Issues ...</div>

const StyledNavLink = props => (
  <NavLink className="bg-white tab" activeClassName="tab--active" {...props}>
    {props.children}
  </NavLink>
)

export default WorkPanel
