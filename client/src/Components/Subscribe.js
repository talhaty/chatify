import React from "react";
import Card from "./Card";
import { useEffect, useState, useRef } from "react";
import ParticlesComponent from "./ParticlesComponent";
import "./Subscribe.css";
import logo from "./logo.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

function Subscribe() {
  const [loggedIn, setLoggedIn] = useState(false);
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
          setLoggedIn(true);
          setUser(res.user);
        } else throw new Error("Not logged in");
      } catch (error) {
        console.log(error);
      }
    };

    authenticate();
  }, []);

  const formRef = useRef(null);
  const Subscription = async (event) => {
    try {
      event.preventDefault();
      const type = event.target.closest("#basic").childNodes[0].innerHTML;
      console.log(type);
      const res = await fetch(`/subscribe`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          type: type,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.path) {
            window.location.href = res.path;
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const navigation = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0 }}
    >
      <ParticlesComponent />
      <div id="subLogo">
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

      <div id="packages">
        <form id="basic" onSubmit={Subscription}>
          <h1>Basic</h1>
          <p>10 Requests/Day</p>
          <p>Answers limited to 256 tokens +/- 200 words</p>
          <p>0.30$/Day</p>
          <p>$9/Monthly</p>
          <button>Subscribe</button>
        </form>

        <div id="subBar"></div>

        <form id="basic" onSubmit={Subscription}>
          <h1>Professional</h1>
          <p>600 Credits</p>
          <p>20 Requests/Day</p>
          <p>Answers limited to 1000 tokens +/- 700 words</p>
          <p>360-day archive of all requests and answers</p>
          <p>0.50$/Day</p>
          <p>$12.50/Monthly</p>
          <button>Subscribe</button>
        </form>

        <div id="subBar"></div>

        <form id="basic" onSubmit={Subscription}>
          <h1>Enterprise</h1>
          <p>1500 Credits(+ 5 Images)</p>
          <p>Unlimited Requests</p>
          <p>No Answer Limit</p>
          <p>0.50$/Day</p>
          <p>$49/Monthly</p>
          <button>Subscribe</button>
        </form>

        <div id="subBar"></div>

        <form id="basic" onSubmit={Subscription}>
          <h1>Pay as you go</h1>
          <p>10-50$ Top Up Approximately</p>
          <p>0.04$/750 Words</p>
          <p>Credit Validity : 1 Year</p>
          <button>Subscribe</button>
        </form>

        <div id="subBar"></div>

        <form id="basic" onSubmit={Subscription}>
          <h1>Image Top Up</h1>
          <p>10$/50 Images</p>
          <p>1 Free Test Image</p>
          <button>Subscribe</button>
        </form>

        <div id="subBar"></div>
      </div>

      <div id="note">
        <h1>Note</h1>
        <p>
          Archives remain active for 360 days if the corresponding subscriptions
          are paid After that they are not accessible anymore Credits remain
          active for 90 days. After that, they expire automatically. In the case
          of cancellation, credits remain valid for 90 days after cancellation.
          After that they expire automatically
        </p>
      </div>
    </motion.div>
  );
}

export default Subscribe;
