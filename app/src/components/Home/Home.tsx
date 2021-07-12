/**
 *  Author: JuanJosé Conejo Sanabria
 *  Description: Page Home
 */

import React from 'react';
import './Home.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PosComponent from "./../Pages/POS/pos";
import Products from "./../Pages/Products/Products";
import { useHistory } from "react-router-dom";

const Home = () => {

    let history = useHistory();

    const logout = () => {
        localStorage.clear();
        history.push("/");
    }

    return (
        <Router>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link className="navbar-brand" to="/Products">Products</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
                    aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/PosComponent">POS</Link>
                        </li>
                    </ul>
                </div>
                <form className="d-flex">
                    <button className="btn btn-success" onClick={logout} type="submit">logout</button>
                </form>
            </nav>

            <div className="container">
                <Switch>
                    <Route path="/Products">
                        <Products />
                    </Route>
                    <Route path="/PosComponent">
                        <PosComponent />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default Home;