import React from "react";
import "./GetStarted.css";
import { Link, NavLink } from "react-router-dom";

const GetStarted = () => {
  return (
    <div id="get-started" className="g-wrapper">
      <div className="paddings innerWidth g-container">
        <div className="flexColCenter inner-container">
          <span className="primaryText">Get started with REAL ESTATE</span>
          <span className="secondaryText">
            Subscribe and find super attractive price quotes from us.
            <br />
            Find your residence soon
          </span>
          <button className="button" href>
          <Link to="/register">
            <a >Get Started</a>
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
