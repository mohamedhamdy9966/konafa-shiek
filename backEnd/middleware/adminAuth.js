import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!token) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Decode and verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.email !== process.env.ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;