import React, { useEffect, useState } from "react";
import ParticlesComponent from "./ParticlesComponent";
import logo from "./logo.png";
import "./Login.css";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigate();

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
          setLoggedIn(true);
          setUser(res.user);
        } else throw new Error("Not logged in");
      } catch (error) {
        console.log(error);
      }
    };

    authenticate();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      let res = await fetch("/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      res = await res.json();
      setLoggedIn(true);
      window.location = "/";
    } catch (error) {
      setError(error);
    }
  };

  if (loggedIn) return <p>You are logged in!</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0 }}
    >
      <ParticlesComponent />
      <div id="authLogo">
        <img
          onClick={() => {
            navigation("/");
          }}
          src={logo}
          alt="chattyfai logo"
        />
        <div
          onClick={() => {
            navigation("/nav");
          }}
          id="menuButton"
        >
          <div id="bar1"></div>
          <div id="bar2"></div>
          <div id="bar3"></div>
        </div>
      </div>

      {error && <p>{error}</p>}

      <div id="loginContainer">
        <h1>Login</h1>
        <p>Login to your account and immediately access our bots</p>
      </div>

      <form id="loginForm" onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          id="email"
          for="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Username/Email"
        />
        <br />
        <input
          type="password"
          value={password}
          id="pass"
          for="pass"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />

        <p>Reset Password</p>

        <button type="submit">Sign In</button>

        <p
          onClick={() => {
            navigation("/signup");
          }}
          id="signUpLink"
        >
          Don't have an account yet ? <a href="#">Sign Up</a>
        </p>
      </form>
    </motion.div>
  );
}

export default Login;
