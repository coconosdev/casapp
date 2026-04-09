import React from 'react';
import { NavLink } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

export default function Nav() {
  return (
    <nav>
      <AppBar position="static">
        <Toolbar>
          <NavLink activeClassName="active-nav" exact to="/">
            Comidas
          </NavLink>
        </Toolbar>
      </AppBar>
    </nav>
  );
}
