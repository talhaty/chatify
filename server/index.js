require("dotenv").config();
const path = require("path");
const { pool } = require("./db");
const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { Translate } = require("@google-cloud/translate").v2;
const stripe = require("stripe")(`${process.env.STRIPE}`);
// const gClient = new OAuth2Client(`${process.env.GOOGLE_CLIENTID}`);
const nodemailer = require("nodemailer");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: `${process.env.OPENAI_KEY}`,
});
const openai = new OpenAIApi(configuration);
// const { Pool } = require("pg");
const translate = new Translate({ key: `${process.env.GOOGLE_TRANSLATE_KEY}` });
const app = express();

const port = process.env.PORT || 5500;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const googleClient = new OAuth2Client({
  clientId: "your-google-client-id",
  clientSecret: "your-google-client-secret",
});

// Middlewares
async function translatePage(req, res) {
  const browserLanguage = req.headers["accept-language"].split(",")[0].trim();
  const userLanguage = req.query.language || browserLanguage;
  // const text = "Hello World!!";
  const { text } = req.query;

  try {
    const translatedText = await translate.translate(text, {
      to: userLanguage,
    });
    console.log(translatedText);
    res.status(200).send({ translation: translatedText.text });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getUserByEmailAndPassword(email, password) {
  let { rows } = await pool.query(
    `select * from users where email = '${email}' and type = 'C';`
  );
  const user = rows[0];
  if (!user) {
    return null;
  }
  rows = await pool.query(`select * from c_user where id = '${user.id}'`);
  user.password = rows.rows[0].password;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }
  return user;
}

async function getUserByGoogleId(googleId) {
  const { rows } = await pool.query(
    `select * from users where google_id = ${googleId}`
  );
  const user = rows[0];
  return user;
}

async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `insert into users(user_name, email, type, active) values ('${name}', '${email}', 'C', true) returning *;`
  );
  const row = await pool.query(
    `insert into c_user(id, password) values ('${rows[0].id}', '${hashedPassword}') returning *;`
  );
  const { rows: rows2 } = await pool.query(
    `insert into Subscription(id, tokens, requests, plan_type) values ('${rows[0].id}',256, 3, 'None') returning *;`
  );
  const user = rows[0];
  return user;
}

async function insertArchives(question, answer, query_id, user_name) {
  const { rows } = await pool.query(
    `insert into archive(query_id, user_name, question, answer, counter) values ('${query_id}', '${user_name}', '${question}', '${answer}', 1) returning *;`
  );

  const archive = rows[0];
  return archive;
}

async function createKeywords(msg) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `can you give me keywords used in this question: ${msg}`,
    max_tokens: 1000,
    temperature: 0,
  });
  return response.data.choices;
}

async function getFAQ() {
  const { rows } = await pool.query(
    `SELECT question FROM Archive ORDER BY counter desc LIMIT 3;`
  );
  return rows;
}

// Routes
app.post("/chatgpt", async (req, res) => {
  const { msg, username } = req.body;
  try {
    // const session = await stripe.checkout.sessions.retrieve('cs_test_a1s8PCUisS4mr4PSkG0MldraXZrAGo37VvvxADGxM0gFddax2PppbCWomo');
    const { rows: rows1 } = await pool.query(
      `select * from Subscription where id = (SELECT id FROM Users WHERE user_name = '${username}')`
    );
    if (rows1[0].requests <= 0) {
      res
        .status(200)
        .send({ message: "requests not available", status: "1200" });
    } else {
      const response = await openai.createChatCompletion({
        max_tokens: rows1[0].tokens,
        model: "gpt-3.5-turbo",
        messages: msg,
      });
      const { rows } = await pool.query(
        `UPDATE Subscription SET requests = ${
          rows1[0].requests - 1
        } WHERE sb_id = '${rows1[0].sb_id}' returning *;`
      );
      // console.log(response.data.choices);
      //keywords are generated here still left not implemented for database!!
      console.log(await createKeywords(msg));
      //query to get faqs not implemented in frontend!
      const fAQs = getFAQ();
      // insertArchives(msg, response.data.choices[0].message.content.replace("'", ""),'xyz12345', 'ZaidDandia');
      res
        .status(200)
        .json({ choices: response.data.choices, requests: rows[0].requests });
    }
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

app.post("/verify", (req, res) => {
  const token = req.cookies.chattytoken;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ user: user, message: "Token is valid" });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

app.post("/verify/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE user_name = '${username}'`
    );
    const user = rows[0];

    const { rows: rows2 } = await pool.query(
      `SELECT * FROM subscription where id = '${user.id}'`
    );
    user.requests = rows2[0].requests;
    res.status(200).json({ user: user });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password, googleToken } = req.body;

  if (googleToken) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: "your-google-client-id",
      });
      const payload = ticket.getPayload();
      const googleId = payload.sub;
      const user = await getUserByGoogleId(googleId);
      if (!user) {
        return res.status(401).json({ message: "Invalid username/password" });
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    const user = await getUserByEmailAndPassword(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid username/password" });
    }
    const chattyToken = jwt.sign(
      { id: user.id, username: user.user_name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("chattytoken", chattyToken, {
      sameSite: "None",
      secure: true,
      httpOnly: true,
    });
    res.json({ path: "/" });
  }
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await createUser(username, email, password);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/subscribe", async (req, res) => {
  const type = req.body.type;
  console.log(type);
  let price_id;
  const { rows: rows1 } = await pool.query(
    `SELECT * FROM Plans WHERE plan_id = '${type}'`
  );

  try {
    if (type === "Basic" || type === "Professional" || type === "Enterprise") {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: rows1[0].plan_id,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `http://localhost:3000/success/?session_id={CHECKOUT_SESSION_ID}`,
      });
      res.send({ path: session.url });
    } else {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: rows1[0].plan_id,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:3000/success/?session_id={CHECKOUT_SESSION_ID}`,
      });
      res.send({ path: session.url });
    }
  } catch (error) {
    console.log(error);

    res.status(400).send({ path: "/failure" });
  }
});

app.post("/success/:id", async (req, res) => {
  try {
    console.log("hello");
    const { id } = req.params;
    const { username } = req.body;
    const session = await stripe.checkout.sessions.listLineItems(id);
    const { rows: rows1 } = await pool.query(
      `SELECT * FROM Plans WHERE plan_id = '${session.data[0].price.id}'`
    );
    const { rows } = await pool.query(
      `Update Subscription SET tokens = ${rows1[0].tokens}, requests = ${rows1[0].requests}, plan_type = '${rows1[0].plan_name}', p_id = '${rows1[0].plan_id}',active = true where id = (SELECT id FROM Users WHERE user_name = '${username}') RETURNING *`
    );
    res.send({ message: "success" });
  } catch (error) {
    console.log(error);
    res.send({ message: "failed" });
  }
});

app.post("/failure", async (req, res) => {
  res.send({ message: "failed" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port} at http://localhost:${port}`);
});
