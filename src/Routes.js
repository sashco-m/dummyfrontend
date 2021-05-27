import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./containers/Home";

import Order from "./containers/Order";

import Form from './components/Form.js';

import NotFound from "./containers/NotFound";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/placeOrder">
        <Form />
      </Route>
      <Route exact path="/order/:id">
        <Order />
      </Route>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}