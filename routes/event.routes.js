const router = require("express").Router();
const User = require("../models/User.model.js");
const Event = require("../models/Event.model.js");

const isAuthenticated = require("../middlewares/auth.middlewares.js");

//GET "/exercise" => renderizar los exercissios
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const response = await Exercise.find().select({
      category: 1,
      image: 1,
      tagline: 1,
      calories: 1,
      name: 1,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

//POST "/exercise" => crear exercissio
router.post("/", isAuthenticated, async (req, res, next) => {
  const {
    latitude,
    longitude,
    date,
    hour,
    description,
    typeEvent,
    titre,
    image,
  } = req.body;
  const { _id } = req.payload;
  try {
    await Event.create({
      owner: _id,
      latitude,
      longitude,
      description,
      date,
      hour,
      typeEvent,
      titre,
      participant: [],
      image,
    });
  } catch (error) {
    next(error);
  }
  res.json("the event was create");
});

//GET "/:id" => renderizar a detailles de el exercissio
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  //! il manque le populate pour recuperer les nom des participant et peutetre de createur de l event
  try {
    const response = await Event.findById(id);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

//PATCH "/:id" => edit el exercissio por su id
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const {
    latitude,
    longitude,
    date,
    hour,
    description,
    typeEvent,
    titre,
    image,
  } = req.body;

  try {
    await Event.findByIdAndUpdate(id, {
      latitude,
      longitude,
      date,
      hour,
      description,
      typeEvent,
      titre,
      image,
    });
    res.json("the edit it's OK");
  } catch (error) {
    next(error);
  }
});

//DELETE "/:id" => delete el exercissio por su id
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await Event.findByIdAndDelete(id);
    res.json("the event was delete");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
