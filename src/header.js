import React from "react";
import { Link } from "react-router-dom";
import Logo from "./images/Logo.png";

export default function header() {
  return (
    <header>
      <img className="logo" src={Logo} alt="Logo" />
      <navbar className="navbar">
        <Link className="link" to="/">
          Home
        </Link>
        <Link className="link" to="contact">
          Contact
        </Link>
      </navbar>
    </header>
  );
}
