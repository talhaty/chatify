import React, { useEffect, useState } from "react";
import "./Error.css";
import ParticlesComponent from "./ParticlesComponent";
import { useNavigate } from "react-router";
import robot from "./robot.png";

function ErrorPage(props) {
  const [user, setUser] = useState(null);

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
          setUser(data.user);
        } else throw new Error("Not logged in");
      } catch (error) {
        console.log(error);
      }
    };

    const ErrorFunction = async (event) => {
      try {
        await authenticate();
        const id = window.location.href.split("session_id=")[1];
        if (id !== undefined) {
          const res = await fetch(`/success/${id}`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              username: user.username,
            }),
          });
          const data = await res.json();
          console.log(data.message);
        } else {
          const response = await fetch(`/failure`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
          });
          const failure = await response.json();
          console.log(failure.message);
        }
      } catch (error) {}
    };

    ErrorFunction();
  }, []);

  const navigation = useNavigate();
  return (
    <>
      <ParticlesComponent />
      <div id="mainErrorContainer">
        <div id="errorContainer">
          <h1>Oops !</h1>
          <p id="desc1">{props.desc1}</p>
          <p id="desc2">{props.desc2}</p>
          <p id="links">Here are some helpful links : </p>
          <ul>
            <li
              onClick={() => {
                navigation("/");
              }}
            >
              Home
            </li>
            <li
              onClick={() => {
                navigation("/about");
              }}
            >
              About Us
            </li>
            <li
              onClick={() => {
                navigation("/subscribe");
              }}
            >
              Subscription
            </li>
            <li
              onClick={() => {
                navigation("/login");
              }}
            >
              Login
            </li>
            <li
              onClick={() => {
                navigation("/signup");
              }}
            >
              Sign Up
            </li>
          </ul>
        </div>

        <div id="errorRobot">
          <img src={robot} alt="robot" />
        </div>
      </div>
    </>
  );
}

export default ErrorPage;
