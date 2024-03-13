import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

export const Navigation = () => {
  return (
    <nav className="main-nav">
      <ul>
        <li>
          <Link to="/">Events</Link>
        </li>
        <li className="add-event">
          <Link to="/event/new">Add event</Link>
        </li>
      </ul>
    </nav>
  );
};
