import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login/Login"
import Home from "./components/Home/Home";

const App = () => {
  return (
    <div className="app-routes">
      <Router>
        <Switch>
          <Route path="/Home" component={Home} />
          <Route path="/" component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
