import React, { useState, useEffect } from "react";
import ParticlesComponent from "./ParticlesComponent";
import logo from "./logo.png";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

function Signup() {
  const [user, setUser] = useState(null);
  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [signedUp, setSignedUp] = useState(false);

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
          setUser(res.user);
        } else throw new Error("Not logged in");

        if (user) window.location = "/";
      } catch (error) {
        console.log(error);
      }
    };

    authenticate();
  }, []);

  const navigation = useNavigate();
  const handleSignup = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await res.json();
    console.log(data);
    if (res.ok) setSignedUp(true);
    else setError(data.error);
  };

  if (signedUp) return <p>You have succesfully signed up!</p>;

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
        <h1>Sign Up</h1>
        <p>Create an account and immediately get access to our bots</p>
      </div>

      <form id="loginForm" onSubmit={handleSignup}>
        <input
          type="text"
          value={username}
          onChange={(event) => setusername(event.target.value)}
          id="username"
          for="username"
          placeholder="Username"
        />
        <br />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          id="email"
          for="email"
          placeholder="Email"
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          id="pass"
          for="pass"
          placeholder="Password"
        />
        <br />
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          id="pass"
          for="pass"
          placeholder="Password"
        />

        <p>Already Have an Account ? Login</p>

        <button type="submit">Sign Up</button>
      </form>
    </motion.div>
  );
}

export default Signup;
