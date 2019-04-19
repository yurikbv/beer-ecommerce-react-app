import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Checkout from "./components/Checkout";
import 'gestalt/dist/gestalt.css';
import Navbar from "./components/Navbar";

const Root = () => (
    <Router>
      <React.Fragment>
        <Navbar />
        <Switch>
          <Route exact component={App} path="/"/>
          <Route component={Signin} path="/signin"/>
          <Route component={Signup} path="/signup"/>
          <Route component={Checkout} path="/checkout"/>
        </Switch>
      </React.Fragment>
    </Router>
);

ReactDOM.render(<Root />, document.getElementById('root'));

serviceWorker.unregister();
