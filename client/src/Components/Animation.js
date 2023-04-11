import React from "react";
import { useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Aboutus from "./Aboutus";
import Subscribe from "./Subscribe";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import Error from "./Error";
import { Routes, Route } from "react-router-dom";

function Animation() {
  const location = useLocation();
  return (
    <>
      <AnimatePresence location={location} key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nav" element={<Navbar />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/success" element={<Error />} />
          <Route path="/failure" element={<Error />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default Animation;
