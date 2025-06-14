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
import helmet from "helmet";

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cookieParser());
// ✅ Heroku: trust the proxy
app.set('trust proxy', 1);
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

// Helmet CSP middleware
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://apis.google.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com", // Google API
      ],
      fontSrc: ["'self'", "data:"],
      imgSrc: ["'self'", "data:"],
      connectSrc: [
        "'self'",
        "https://www.googleapis.com",
        process.env.BACKEND_URL ||
          "https://gamekart-abc4d465fae0.herokuapp.com",
      ],
      frameSrc: ["'self'", "https://accounts.google.com"],
    },
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
      sameSite: "none",
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
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("Server is running"));

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
