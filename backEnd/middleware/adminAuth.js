import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const actualToken = token.startsWith("admin_") ? token.slice(6) : token; // Remove "admin_" prefix
    if (!token) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const decodedToken = jwt.verify(actualToken, process.env.JWT_SECRET);
    if (decodedToken.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;