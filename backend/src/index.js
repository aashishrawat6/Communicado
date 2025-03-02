import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { io, app, server } from "./lib/socket.js"; // importing the server from socket.js
import path from "path";
// const app = express(); // removed this line because we are importing it from socket.js

dotenv.config();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve(); // added this line to fix the __dirname issue

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()); // middleware to extract json data out of req.body
app.use(cookieParser()); // we need to use cookie parser to parse the cookies
app.use("/api/auth", authRoutes); // middleware
app.use("/api/messages", messageRoutes); // middleware

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend ", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
