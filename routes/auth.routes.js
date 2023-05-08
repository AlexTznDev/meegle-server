const router = require("express").Router();
const User = require("../models/User.model.js");
const firebaseAdmin = require("../firebaseAdmin");
const jwt = require("jsonwebtoken");

// 5. apel du middleware MiddleWare (isAuthenticated)
const isAuthenticated = require("../middlewares/auth.middlewares.js");

// POST "/auth/signup" creer dans la data base
router.post("/signup", async (req, res, next) => {
  const { firebaseToken } = req.body;
  console.log(req.body);

  try {
    // Verify the Firebase ID token
    const decodedToken = await firebaseAdmin
      .auth()
      .verifyIdToken(firebaseToken);

    if (!decodedToken) {
      res.status(400).json({ errorMessage: "Invalid token" });
      return;
    }

    // create user based on Firebase UID
    const { uid, email } = decodedToken;
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email: email,
        username: "Username",
        friends: [],
      });
    } else {
      res.status(200).json({ errorMessage: "Already registered" });
      return;
    }

    // Create JWT for user
    const jwtSecret = process.env.TOKEN_SECRET;
    const jwtPayload = {
      userId: user._id,
      firebaseUid: uid,
    };
    const jwtOptions = {
      expiresIn: "24h",
    };
    const authToken = jwt.sign(jwtPayload, jwtSecret, jwtOptions);

    res.status(200).json({ message: "User created successfully", authToken });
  } catch (error) {
    console.error("Error:", error); // Add error logging here
    res.status(500).json({ errorMessage: "An error occurred during login" });
    next(error);
  }
});

// POST "/auth/login" Valider credential

router.post("/login", async (req, res, next) => {
  const { firebaseToken } = req.body;

  try {
    // Verify the Firebase ID token
    const decodedToken = await firebaseAdmin
      .auth()
      .verifyIdToken(firebaseToken);

    if (!decodedToken) {
      res.status(400).json({ errorMessage: "Invalid token" });
      return;
    }

    // Find or create user based on Firebase UID
    const { uid } = decodedToken;
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      res.status(200).json({ errorMessage: "There is no created user" });
      return
    }

    // Create JWT for user
    const jwtSecret = process.env.TOKEN_SECRET;
    const jwtPayload = {
      userId: user._id,
      firebaseUid: uid,
    };
    const jwtOptions = {
      expiresIn: "24h",
    };
    const authToken = jwt.sign(jwtPayload, jwtSecret, jwtOptions);

    res
      .status(200)
      .json({ message: "Logged in successfully", authToken, user });
  } catch (error) {
    console.error("Error:", error); // Add error logging here
    res.status(500).json({ errorMessage: "An error occurred during login" });
    next(error);
  }
});

// GET "/auth/verify" => verifier si l utilisateur est actif

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log(req.payload);
  res.status(200).json(req.payload);
});

module.exports = router;
