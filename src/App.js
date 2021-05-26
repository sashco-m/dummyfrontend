import Form from './components/Form.js';

import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";

import Routes from "./Routes";

import { LinkContainer } from "react-router-bootstrap";

function App() {
  return (
    <div className="App">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
        <LinkContainer to="/">
          <Navbar.Brand className="font-weight-bold text-muted">
            Demo Screens
          </Navbar.Brand>
        </LinkContainer>
      </Navbar>
      <Routes />
    </div>
  );
}

export default App;
