const router = require("express").Router();
const User = require("../models/User.model.js");
const firebaseAdmin = require("../firebaseAdmin");

// 5. apel du middleware MiddleWare (isAuthenticated)
const isAuthenticated = require("../middlewares/auth.middlewares.js");

// POST "/auth/signup" creer dans la data base
router.post("/signup", async (req, res, next) => {
    const { email, firebaseUid } = req.body;
    console.log(req.body);
  
    try {
      const foundUserUID = await User.findOne({ firebaseUid: firebaseUid });
  
      if (foundUserUID !== null) {
        res
          // .status(400)
          .json({ userExists: true, errorMessage: "User already created" });
        return;
      }
  
      await User.create({
        email: email,
        firebaseUid: firebaseUid,
        name: "Username",
        friends: [],
      });
      res.json({ message: "User created" });
    } catch (error) {
      next(error);
    }
  });
  

// POST "/auth/login" Valider credential
router.post("/login", async (req, res, next) => {
  const { firebaseToken } = req.body;
  console.log(req.body);

  try {
    // Verify the Firebase ID token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(firebaseToken);

    if (!decodedToken) {
      res.status(400).json({ errorMessage: "Invalid token" });
      return;
    }

    // Find or create user based on Firebase UID
    const { firebaseUid, email } = decodedToken;
    let user = await User.findOne({ firebaseUid: firebaseUid });

    if (!user) {
      user = await User.create({
        firebaseUid: firebaseUid,
        email: email,
        name: "Username",
        friends: [],
      });
    }

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    next(error);
  }
});

// GET "/auth/verify" => verifier si l utilisateur est actif

router.get("/verify", isAuthenticated, (req, res, next) => {

console.log(req.payload)    
res.status(200).json(req.payload)

});










module.exports = router;