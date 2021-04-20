import React, { Component } from "react";
import { render } from "react-dom";
import styled from "styled-components";
import { BrowserRouter, Route } from "react-router-dom";

import {RateHouses} from "./pages/rateHouses";
import {Header} from "./components/header";

import CompletedPage from "./pages/completed";
import LoginPage from "./pages/login";
import SelectZipPage from "./pages/selectZip";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import {Nav, Navbar, NavbarBrand, NavItem, NavLink} from "shards-react";

const StyledNavBar = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid #ebebeb;
`;

const GridBase = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "hd"
    "main"
    "ft";

  @media (min-width: 500px) {
    grid-template-columns: 40px 50px 1fr 50px 40px;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "hd hd hd hd hd"
      "sb sb main main main"
      "ft ft ft ft ft";
  }
`;


// this is the base of the website
class MyApp extends Component {
    constructor(props) {
        super(props);

        // If the user has logged in, grab info from sessionStorage
        const preloaded = window.__PRELOADED_STATE__ || {};
        this.state = {
            status: preloaded.state,
            respondent: preloaded.respondent,
            zip: preloaded.zip
        };

        // just gotta do this cause React
        this.renderStatus = this.renderStatus.bind(this);
        this.updateStatus = this.updateStatus.bind(this);

        this.setRespondent = this.setRespondent.bind(this);
        this.updateZIP = this.updateZIP.bind(this);
    }

    setRespondent(rid) {
        this.setState({
            respondent: rid
        });
    }

    updateZIP(zip) {
        this.setState({
            zip
        });
    }

    updateStatus(status) {
        this.setState({
            status
        });
    }

    // is the respondent logged in?
    renderStatus(props) {
        switch (this.state.status) {
            case 'select_zip':
                return <SelectZipPage
                    {...props}
                    updateStatus={this.updateStatus}
                    updateZIP={this.updateZIP}
                />
            case 'rank_houses':
                return <RateHouses {...props} updateStatus={this.updateStatus}/>
            case 'completed':
                return <CompletedPage {...props}/>
            default:
                return <LoginPage
                    {...props}
                    updateStatus={this.updateStatus}
                    setRespondent={this.setRespondent}
                />
        }
    }

    render() {
        return (
            <div>
                <StyledNavBar>
                    <Navbar theme={"white"}>
                        <Nav>
                            <NavItem>
                                <NavLink disabled>
                                    Neighborhood Explorer
                                    {this.state.respondent && (
                                        ` (${this.state.respondent}${ this.state.zip ? `, ZIP: ${this.state.zip}` : ""})`
                                    )}
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Navbar>
                </StyledNavBar>
                <BrowserRouter>
                    <Route path="/" render={this.renderStatus}/>
                </BrowserRouter>
            </div>
        );
    }
}

render(<MyApp />, document.getElementById("app"));
