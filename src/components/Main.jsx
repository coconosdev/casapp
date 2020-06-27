import React from 'react';
import Agua from './Agua';
import Mandado from './Mandado';
import Pendientes from './Pendientes';
import { Switch, Route } from 'react-router-dom';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Agua} />
      <Route path="/agua" component={Agua} />
      <Route path="/mandado" component={Mandado} />
      <Route path="/pendientes" component={Pendientes} />
    </Switch>
  </main>
);

export default Main;
