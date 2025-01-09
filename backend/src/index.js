import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";


dotenv.config();


const PORT=process.env.PORT;
const __dirname = path.resolve();

// app.use(express.json());
app.use(express.json({ limit: '50mb' })); // Increase the limit to 50 MB
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Handle large form-data requests
app.use(cookieParser());
app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(PORT,()=>{
    console.log('Server is running on port', PORT);
    connectDB();
});