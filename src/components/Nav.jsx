import React from 'react';
import { NavLink } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

export default function Nav() {
  return (
    <nav>
      <AppBar position="static">
        <Toolbar>
          <NavLink activeClassName="active-nav" exact to="/agua">
            Agua
          </NavLink>
          <NavLink activeClassName="active-nav" exact to="/mandado">
            Mandado
          </NavLink>
          <NavLink activeClassName="active-nav" exact to="/pendientes">
            Pendientes
          </NavLink>
        </Toolbar>
      </AppBar>
    </nav>
  );
}
