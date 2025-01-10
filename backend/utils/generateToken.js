import jwt from "jsonwebtoken";
import dotenv from "dotenv";
const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 1000, //MS
    httpOnly: true, //prevent XSS attacks cross-sitescripting attacks
    sameSite: "strict", //CSRF attacks cross-site request forgery attacks
  });
  console.log("JWT Token set in cookies");
};

export default generateTokenAndSetCookie;
