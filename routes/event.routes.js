const router = require("express").Router();
const User = require("../models/User.model.js");
const Event = require("../models/Event.model.js");

const isAuthenticated = require("../middlewares/auth.middlewares.js");

//GET "/exercise" => renderizar los exercissios
router.get("/", isAuthenticated, async (req, res, next) => {
  const { userId } = req.payload;

  try {
    const response = await Event.find({owner:userId})
    res.json(response);
  } catch (error) {
    next(error);
  }

});



//POST "/" => crear event
router.post("/", isAuthenticated, async (req, res, next) => {
  const { date, hour, localisation, NumberImage, numberPlayerNeed, datePrecise } = req.body;
  const { userId } = req.payload;
  try {
    await Event.create({
      owner: userId,
      date,
      hour,
      localisation,
      NumberImage,
      numberPlayerNeed,
      datePrecise,
      participant: [
        userId
      ],
    });
  } catch (error) {
    next(error);
  }
  res.json("the event was create");
});

//GET "/eventsAll" => renderise tout les events
router.get("/All/", async (req, res, next) => {

  try {
    const response = await Event.find()
    res.json(response);
  } catch (error) {
    next(error);
  }

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



//PATCH "/:id" => edit event
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

//PATCH "/:idEvent/addrequest" => ajouter participant au request de participation a l'évent
router.patch(
  "/:idEvent/addRequest",
  isAuthenticated,
  async (req, res, next) => {
    const { idEvent } = req.params;
    const { _id } = req.payload;

    try {
      await Event.findByIdAndUpdate(idEvent, {
        $push: { requestParticipation: _id },
      });

      res.json("Participant ajouter");
    } catch (error) {
      next(error);
    }
  }
);

//PATCH "/:idEvent/remove" => retirer participant a l'évent
router.patch("/:idEvent/remove", isAuthenticated, async (req, res, next) => {
  const { idEvent } = req.params;
  const { idUser } = req.body;

  try {
    await Event.findByIdAndUpdate(idEvent, {
      $pull: { participant: idUser },
    });

    res.json("Participant retirer");
  } catch (error) {
    next(error);
  }
});

//PATCH "/:idEvent/acceptRequest" => ajouter participant a l'évent
router.patch("/:idEvent/acceptRequest", async (req, res, next) => {
  const { idEvent } = req.params;
  const { idUser } = req.body;

  try {
    await Event.findByIdAndUpdate(idEvent, {
      $pull: { requestParticipation: idUser },
      $push: { participant: idUser },
    });

    res.json("User accepté en participant");
  } catch (error) {
    next(error);
  }
});

//! peutetre possibilité d utiliser une seul route de back pour accepter ou refuser grace a un boolean en envoi req.body
//PATCH "/:idEvent/refuseRequest" => refuser participant a l'évent
router.patch("/:idEvent/refuseRequest", async (req, res, next) => {
  const { idEvent } = req.params;
  const { idUser } = req.body;

  try {
    await Event.findByIdAndUpdate(idEvent, {
      $pull: { requestParticipation: idUser },
    });

    res.json("User refusé");
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
