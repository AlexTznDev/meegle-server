const admin = require("./auth.middlewares");

const isAuthenticated = async (req, res, next) => {
  if (
    req.headers === undefined ||
    req.headers.authorization === undefined
  ) {
    console.log("User doesn't have token");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const tokenArr = req.headers.authorization.split(" ");
  const tokenType = tokenArr[0];
  const token = tokenArr[1];

  if (tokenType !== "Bearer") {
    console.log("Token not valid");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.payload = decodedToken;
    next();
  } catch (error) {
    console.error("Error while verifying token", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
