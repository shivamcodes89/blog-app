const jwt = require('jsonwebtoken');

function protect(req, res, next) {
  // Get the token from the request header
  const token = req.headers.authorization;

  // If no token, deny access
  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  try {
    // Verify the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user info to the request
    req.user = decoded;

    // Move on to the next step
    next();

  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = protect;