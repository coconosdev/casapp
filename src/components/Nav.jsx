import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => (
  <nav>
    <Link to="/">Home</Link>
    <Link to="/agua">Agua</Link>
    <Link to="/mandado">Mandado</Link>
    <Link to="/pendientes">Pendientes</Link>
  </nav>
);

export default Nav;
