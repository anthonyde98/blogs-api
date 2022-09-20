const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if(!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: "No esta autorizado."})
  }
  
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { userId: payload.userId }

    return next()
  } catch (error) {
    return res.status(401).json({ message: "No esta autorizado."})
  }
}

module.exports = auth;