import React from "react";
import "./Navbar.css";
import cross from "./cross.png";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

function Navbar() {
  const navigation = useNavigate();
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100vw", transition: { duration: 0.3 } }}
      exit={{ x: "100%" }}
    >
      <div
        onClick={() => {
          navigation(-1);
        }}
        id="menuCross"
      >
        <img src={cross} />
      </div>
      <div id="menuItems">
        <h1
          onClick={() => {
            navigation("/");
          }}
        >
          Home
        </h1>
        <h1
          onClick={() => {
            navigation("/about");
          }}
        >
          About Us
        </h1>
        <h1
          onClick={() => {
            navigation("/subscribe");
          }}
        >
          Subscribe
        </h1>
        <h1
          onClick={() => {
            navigation("/login");
          }}
        >
          Login
        </h1>
        <h1
          onClick={() => {
            navigation("/signup");
          }}
        >
          Sign Up
        </h1>
      </div>
    </motion.div>
  );
}

export default Navbar;
