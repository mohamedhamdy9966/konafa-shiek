import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decodedToken); // Add debug log
    req.userId = decodedToken.id;
    req.isAdmin = decodedToken.isAdmin || false;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or Expired Token" });
  }
};

export default authUser;
