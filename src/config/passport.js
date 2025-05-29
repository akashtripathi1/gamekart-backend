import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import ApprovedEmail from "../models/ApprovedEmails.js";

dotenv.config();
// Validate environment variables first
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth credentials missing in environment variables");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const approvedEmail = await ApprovedEmail.findOne({ email });

        if (!approvedEmail) {
          return done(null, false, { message: "Email not approved" });
        }

        // Check for existing user by Google ID OR email
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        // Handle existing user with different Google ID
        if (user && user.googleId !== profile.id) {
          return done(null, false, {
            message: "Email already registered with different account",
          });
        }

        // Create new user if doesn't exist
        if (!user) {
          // Generate unique username (email without domain)
          const username = email.split("@")[0];

          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email,
            role: approvedEmail.role,
            username,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Serialization remains the same
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
