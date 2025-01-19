import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is an admin
    if (!decodedToken.isAdmin) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;