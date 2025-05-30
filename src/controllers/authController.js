import passport from "passport";

export const handleGoogleCallback = (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/home`);
};

export const getCurrentUser = (req, res) => {
  res.json({
    isAuthenticated: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      username: req.user.username,
      name: req.user.name,
      role: req.user.role,
    },
  });
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }

      // Clear the right cookie:
      res.clearCookie("gamekart.sid", { path: "/" });
      res.redirect(process.env.CLIENT_URL);
    });
  });
};
