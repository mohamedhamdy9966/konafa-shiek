import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.id; // Ensure this matches the JWT payload
    req.isAdmin = decodedToken.isAdmin || false; // Add isAdmin to the request object

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default authUser;