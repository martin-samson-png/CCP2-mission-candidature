import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Accès refusé" });
  }
  try {
    const decrypted = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decrypted;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ message: "Token invalide" });
  }
};

export default checkAuth;
