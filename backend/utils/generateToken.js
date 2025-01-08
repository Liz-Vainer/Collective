import jwt from "jsonwebtoken";
const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign(
    { userId },
    "/8/daecwqK21qn/lUPuU09HrnnS2qf9eroVuiVQbd54=",
    {
      expiresIn: "15d",
    }
  );

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 1000, //MS
    httpOnly: true, //prevent XSS attacks cross-sitescripting attacks
    sameSite: "strict", //CSRF attacks cross-site request forgery attacks
  });
  console.log("JWT Token set in cookies");
};

export default generateTokenAndSetCookie;
