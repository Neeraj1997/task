const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Neerajisgreat';

const fetchuser = (req, res, next) => {
  const token = req.header('auth-token');
  try {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed: Invalid token or no token provided" });
  }
};

module.exports = fetchuser;