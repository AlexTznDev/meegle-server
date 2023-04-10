const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRoutes = require("./auth.routes.js")
router.use("/auth", authRoutes)


const profilRoutes = require("./profil.routes.js")
router.use("/profil", profilRoutes)

const eventRoutes = require("./event.routes.js")
router.use("/event", eventRoutes)


module.exports = router;
