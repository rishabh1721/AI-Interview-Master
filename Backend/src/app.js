const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-interview-master-1.onrender.com",
    ],
    credentials: true,
  }),
);

/* require all the routes here */

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

console.log("AUTH ROUTER:", typeof authRouter);
console.log("INTERVIEW ROUTER:", typeof interviewRouter);
console.log(interviewRouter);

/* using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;
