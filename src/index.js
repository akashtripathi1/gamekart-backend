import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import connectDB from "./config/db.js";
import errorMiddleware from "./middlewares/errorHandleMiddleware.js";

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    name: "gamekart.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Import passport configuration
import "./config/passport.js";

// Routes
import authRoutes from "./routes/authRoutes.js";

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Server is running"));

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
