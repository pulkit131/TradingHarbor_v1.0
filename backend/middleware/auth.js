const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const [bearer,token] = authHeader.split(' ');
    if (!bearer || !token || bearer!== 'Bearer') {
      return res.status(401).json({ error: 'Malformed token' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    req.user = ticket.getPayload(); // Attach Google user info to request
    next();
  } catch (error) {
    console.error('Google token verification failed:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = auth;
