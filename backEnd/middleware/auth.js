import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    // Check if the token is missing
    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId from the decoded token to the request object
    req.userId = decodedToken.id;

    // Pass control to the next middleware
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default authUser;
