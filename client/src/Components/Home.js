import React, { useEffect, useState } from "react";
import ParticlesComponent from "./ParticlesComponent";
import logo from "./logo.png";
import "./Home.css";
import Chatbox from "./Chatbox";
import cross from "./cross.png";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

function Home() {
  const navigation = useNavigate();

  const [menuStatus, setMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const menuManager = () => {
    navigation("/nav");
    console.log("Navigation");
  };

  useEffect(() => {
    const authenticate = async () => {
      try {
        const res = await fetch("/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setLoggedIn(true);
          setUser(data.user);
        } else throw new Error("Not logged in");
      } catch (error) {
        console.log(error);
      }
    };

    authenticate();
  }, []);
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        exit={{ opacity: 0 }}
      >
        <ParticlesComponent />
        <div id="logoContainer">
          <img id="homeLogo" src={logo} alt="logo" />
          <div
            onClick={() => {
              menuManager();
            }}
            id="menuButton"
          >
            <div id="bar1"></div>
            <div id="bar2"></div>
            <div id="bar3"></div>
          </div>
        </div>
        <div>Loading....</div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0 }}
    >
      <ParticlesComponent />
      <div id="logoContainer">
        <img id="homeLogo" src={logo} alt="logo" />
        <div
          onClick={() => {
            menuManager();
          }}
          id="menuButton"
        >
          <div id="bar1"></div>
          <div id="bar2"></div>
          <div id="bar3"></div>
        </div>
      </div>
      <div id="homeContainer">
        <Chatbox user={user} />
      </div>
    </motion.div>
  );
}

export default Home;
