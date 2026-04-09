import React from 'react';
import Comidas from './Comidas';
import Agua from './Agua';
import Mandado from './Mandado';
import Pendientes from './Pendientes';
import { Switch, Route } from 'react-router-dom';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Comidas} />
      <Route path="/comidas" component={Comidas} />
      <Route path="/agua" component={Agua} />
      <Route path="/mandado" component={Mandado} />
      <Route path="/pendientes" component={Pendientes} />
    </Switch>
  </main>
);

export default Main;
