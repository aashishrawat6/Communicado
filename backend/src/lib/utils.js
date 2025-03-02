import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => { // userId will be taken from payload
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, { // jwt is the name of the cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // converted in ms for more security
    httpOnly: true, // prevents xss attacks cross-site scripting attacks such token is not accessible via js and only through http
    sameSite: "strict", //CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
