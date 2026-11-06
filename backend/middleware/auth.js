import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const secret = process.env.JWT_SECRET || "quickbite_jwt_secret_dev_key";
    const token_decode = jwt.verify(token, secret);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"});
  }
};
export default authMiddleware;
